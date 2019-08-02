import path from 'path';
import { Compiler, Plugin } from 'webpack';
import { Stats } from './Stats';
import { buildContent } from './utils';

export type VarTarget = 'const' | 'window' | 'global';
export interface Options {
    [K: string]:
        | string
        | {
              type?: VarTarget;
              value: string;
          };
}

export class DefineVariablePlugin implements Plugin {
    private readonly pluginName = this.constructor.name;
    private readonly options: Partial<Options> = {};

    public constructor(options: Options) {
        this.options = { ...this.options, ...options };
    }

    public apply(compiler: Compiler): void {
        const ifs = compiler.inputFileSystem;

        const statStorage: { data: Map<string, [Error | null, Stats]> } = (ifs as any)._statStorage;
        const readFileStorage: { data: Map<string, [Error | null, string]> } = (ifs as any)._readFileStorage;

        const CONTENT = buildContent(this.options);
        const PATH = path.resolve(compiler['context'], 'node_modules/define-variable-webpack-plugin/dynamicImporter');

        compiler.hooks.normalModuleFactory.tap(this.pluginName, nmf => {
            nmf.hooks.beforeResolve.tap(this.pluginName, () => {
                if (readFileStorage.data.has(PATH)) {
                    return;
                }

                statStorage.data.set(PATH, [null, Stats.genericStats(CONTENT)]);
                readFileStorage.data.set(PATH, [null, CONTENT]);
            });
        });
    }
}

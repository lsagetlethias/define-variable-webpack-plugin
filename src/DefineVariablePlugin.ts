import path from 'path';
import { Compiler, Plugin } from 'webpack';
import { Stats } from './Stats';

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

        let CONTENT = 'const dynamicImporter = {};\n';

        let target: VarTarget | 'dynamicImporter' = 'dynamicImporter';
        let value = 'null';
        for (const [varName, opt] of Object.entries(this.options)) {
            if (typeof opt === 'string') {
                value = opt;
            } else {
                target = opt.type || 'dynamicImporter';
                target = target === 'const' ? 'dynamicImporter' : target;
                value = opt.value;
            }

            CONTENT += `${target}["${varName}"] = ${value};\n`;
        }

        CONTENT += 'export { dynamicImporter };\n';

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

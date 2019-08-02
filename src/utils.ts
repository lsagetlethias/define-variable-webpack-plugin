import { Options, VarTarget } from './DefineVariablePlugin';

export function buildContent(options: Options) {
    let CONTENT = 'const dynamicImporter = {};\n';

    let target: VarTarget | 'dynamicImporter' = 'dynamicImporter';
    let value = 'null';
    for (const [varName, opt] of Object.entries(options)) {
        if (typeof opt === 'string') {
            value = opt || value;
        } else if (opt) {
            target = opt.type || 'dynamicImporter';
            target = target === 'const' ? 'dynamicImporter' : target;
            value = opt.value || value;
        }

        CONTENT += `${target}["${varName}"] = ${value};\n`;
    }

    CONTENT += 'export { dynamicImporter };\n';

    return CONTENT;
}

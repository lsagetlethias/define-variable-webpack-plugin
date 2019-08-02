// tslint:disable:object-literal-sort-keys
import { buildContent } from '../src/utils';

describe('buildContent', () => {
    it('should work with valid datas', () => {
        const content = buildContent({
            foo: JSON.stringify('bar'),
            bar: JSON.stringify(1),
            baz: JSON.stringify(true),
            qux: JSON.stringify({ a: 1, b: 2 }),
            foobar: JSON.stringify(null),
            foobaz: JSON.stringify(undefined), // undefined value is not stringified so it becomes null at the end
        });
        expect(content).toBe(`const dynamicImporter = {};
dynamicImporter["foo"] = "bar";
dynamicImporter["bar"] = 1;
dynamicImporter["baz"] = true;
dynamicImporter["qux"] = {"a":1,"b":2};
dynamicImporter["foobar"] = null;
dynamicImporter["foobaz"] = null;
export { dynamicImporter };
`);
    });

    it('should work with mixed datas', () => {
        const content = buildContent({
            foo: JSON.stringify('bar'),
            bar: {
                type: 'window',
                value: JSON.stringify(1),
            },
            baz: {
                type: 'global',
                value: JSON.stringify(true),
            },
            qux: {
                type: 'const',
                value: JSON.stringify({ a: 1, b: 2 }),
            },
        });
        expect(content).toBe(`const dynamicImporter = {};
dynamicImporter["foo"] = "bar";
window["bar"] = 1;
global["baz"] = true;
dynamicImporter["qux"] = {"a":1,"b":2};
export { dynamicImporter };
`);
    });

    it('should handle bad datas', () => {
        const content = buildContent({
            foo: null,
            bar: undefined,
        });
        expect(content).toBe(`const dynamicImporter = {};
dynamicImporter["foo"] = null;
dynamicImporter["bar"] = null;
export { dynamicImporter };
`);
    });
});

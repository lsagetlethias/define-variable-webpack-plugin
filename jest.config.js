//@ts-check

/** @type Partial<jest.DefaultOptions> & { [K: string]: any } */
const config = {
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/test/tsconfig.json'
        },
    },
    preset: 'ts-jest',
    transform: {
        '.ts': 'ts-jest',
    },
    testPathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/test/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

module.exports = config;

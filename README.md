<div align="center">
    <br>

[![npm][npm]][npm-url]

[![deps][deps]][deps-url]
[![node][node]][node-url]

<br>
    <a href="https://github.com/webpack/webpack">
        <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
    </a>
    <h1>define-variable-webpack-plugin</h1>
    <p>Enhancement of Webpack DefinePlugin to store defined things in actual variables.</p>
</div>

<h2 align="center">Requirements</h2>

`define-variable-webpack-plugin` relies on [webpack] 4. It will be updated as needed on major updates of webpack.


<h2 align="center">Install</h2>

```bash
yarn add -D define-variable-webpack-plugin
# or
npm i --save-dev define-variable-webpack-plugin
```


<h2 align="center">Usage</h2>
FYI, the following examples are based on a Typescript code based application.

**webpack.config**
```ts
import { DefineVariablePlugin } from 'define-variable-webpack-plugin';
import { Configuration } from 'webpack';

const config: Configuration = {
    // ... your webpack configuration
    plugins: [
        new DefineVariablePlugin({
            myVar: JSON.stringify('test'),
            myWindowVar: {
                type: 'window', // can be: 'window', 'const' (default), 'global'
                value: JSON.string('foo'),
            }
        }),
    ],
}
export default config;
```

**index.ts**
```ts
// fetch the actual variables instead of pure replacement
import { dynamicImporter } from 'define-variable-webpack-plugin/dynamicImporter';

console.log(dynamicImporter.myVar); // 'test'
console.log(Object.entries(dynamicImporter)) // [ ['myVar', 'test'] ]

console.log(window.myWindowVar); // 'foo'
console.log('myWindowVar' in window); // true
```

This will generate a separated chunk with declared variables, loaded on demand by you application.

<h2 align="center">Maintainers</h2>
<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/5783789?v=3&s=150">
        </br>
        <a href="https://github.com/bios21">Lilian Saget-Lethias</a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/define-variable-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/define-variable-webpack-plugin

[node]: https://img.shields.io/node/v/define-variable-webpack-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/bios21/define-variable-webpack-plugin.svg
[deps-url]: https://david-dm.org/bios21/define-variable-webpack-plugin

[webpack]: https://webpack.org
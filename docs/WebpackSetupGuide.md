# Webpack Setup Guide
Here are helpful tips to make webpack work FOR YOU!

## Tip #1: webpack-dev-server
This automates building and deploying your source code to a local development server any time a change is made. It makes development so much faster.

> Note: If you care about size, you might like this [one](https://github.com/shellscape/webpack-plugin-serve) better.

### Steps
[Install it](https://github.com/webpack/webpack-dev-server).
```
npm install webpack-dev-server --save-dev
```

Add it to your webpack config.
```js
module.exports = {
    //...
    devServer: {
        open: true,
        /**
         * This is where your bundled files will be written to (temporarily), and
         * where it can be read from by `index.html`. In other words, this should
         * match the path to resources as specified by the html file.
         * 
         * For example:
         * - In your HTML: `src = "public/assets/script.js"
         * - In your config: `publicPath: '/public/assets/'`
         * 
         * It must always start and end with a forward slash.
         */
        publicPath: '/dist/'
    }
    //...
}
```

Add it to your NPM scripts.
```json
{
    // ...
    "scripts": {
        "start": "webpack serve --mode development",
        // ...
    }
    // ...
}
```

Run it :D
```
npm start
```

## Tip #2: Alias
This allows you to import other files from project root with an alias, like `@app/some-file.js`, instead of some long, hideous relative paths.

### Steps
Add this to your webpack config.
```js
const path = require('path');

module.exports = {
    //...
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'src'),
        }
    }
    //...
};
```

## Tip #3: Cleaning dist folder
Your dist folder can get messy after a while, so we should keep it clean of files we no longer ACTUALLY output (by deleting it each time).

### Setup
[Install it](https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder).
```
npm install clean-webpack-plugin --save-dev
```

Add it to your webpack config.
```js
// ...
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
};
```

And that's it!

## Tip #4: Add autocomplete for config
Yep. It is a [thing](https://joshuatz.com/posts/2020/vscode-intellisense-autocomplete-for-webpack-config-files/#solution-a-use-typescript-definition). Add this to your webpack config.
```js
//...

/** @type { import('webpack').Configuration } */
module.exports = {
    //...
};
```


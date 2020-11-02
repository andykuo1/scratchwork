# CSS Modules Setup Guide
These should help you setup CSS modules.

## Steps
Install the follow:
- [css-loader](https://webpack.js.org/loaders/css-loader/)
    - This will parse your CSS files.
- [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
    - This will extract all your CSS files into one bundled file. Otherwise, you'll have to send and link ALL your small CSS files individually.
```
npm install css-loader --save-dev
npm install mini-css-extract-plugin --save-dev
```

Add them to your webpack config.
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    //...
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        }
                    }
                ]
            }
        ]
    }
};
```

Link the output bundle in your `index.html`.
```html
<html>
    <head>
        <!-- ... -->
        <link rel="stylesheet" href="dist/main.css">
        <!-- ... -->
    </head>
    <!-- ... -->
</html>
```

Create your first CSS module file.
`src/App.module.css`
```css
.container {
    color: dodgerblue;
}
```

`src/App.jsx`
```jsx
import React from 'react';
import Style from './App.module.css';

export function App()
{
    return (
        <button className={Style.container}>
            Boo!
        </button>
    );
}
```

And that's it! Happy coding.

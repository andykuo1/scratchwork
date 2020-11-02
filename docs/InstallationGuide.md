# Installation Guide

## Step 1 - Create your README.md
Do it now. Give it at least a title and a quick description.

## Step 2 - Initialize the project
Run the commands below, and don't forget to add `node_modules` to your git ignore.

```
npm init -y
git init
touch .gitignore
```

## Step 3 - Install the essentials

```
npm install webpack webpack-cli @babel/core @babel/preset-react babel-loader --save-dev
npm install react react-dom --save
```

## Step 4 - Create the configs

`.babelrc`
```json
{
    "presets": ["@babel/preset-react"]
}
```

`webpack.config.js`
```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
}
```

## Step 5 - Create your entrypoints

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>App</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="dist/main.js"></script>
    </body>
</html>
```

`src/index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App.jsx';

ReactDOM.render(React.createElement(App), document.querySelector('#root'));
```

`src/App.jsx`
```jsx
import React from 'react';

export function App()
{
    return (
        <button>
            Boo!
        </button>
    );
}
```

## Step 6 - Run it.

```
npx webpack --mode production
```

## Step 7 - Celebrate
Yep! That's it!

## Step 8 - Realize there is more
...Yeah, there's more. Refer to other features' install guides for details.

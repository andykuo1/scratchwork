# SVG Setup Guide
This allows you to simply import SVG files directly. No need for individual React wrappers for EVERY `.svg` file you use.

## Setup
[Install it](https://github.com/gregberge/svgr/tree/master/packages/webpack).
```
npm install @svgr/webpack --save-dev
```

Add it to your webpack config.
```js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack']
            }
        ]
    }
    //...
};
```

Try it out!
`src/close.svg`
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
```

`App.jsx`
```jsx
import React from 'react';
import Close from './close.svg';

export function App()
{
    return (
        <button>
            <Close />
        </button>
    );
}
```
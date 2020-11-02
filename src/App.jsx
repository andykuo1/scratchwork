import React from 'react';
import Style from './App.module.css';
import Close from './close.svg';

export function App()
{
    return (
        <div>
            <button className={Style.container}>
                Boo!
            </button>
            <Close />
        </div>
    );
}
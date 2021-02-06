import React from 'react';
import Style from './App.module.css';
import { StackedDeck } from './StackedDeck.jsx';

export function App()
{
    return (
        <Providers>
            <Contents/>
        </Providers>
    );
}

export function Providers(props)
{
    const { children } = props;
    return (
        <div>
            {children}
        </div>
    );
}

export function Contents()
{
    return (
        <>
        <StackedDeck/>
        </>
    );
}

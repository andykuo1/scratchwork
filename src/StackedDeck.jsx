import React from 'react';
import Style from './StackedDeck.module.css';

import { ItemCard } from './ItemCard.jsx';

export function StackedDeck()
{
    return (
        <ul className={Style.container}>
            <li>
                <ItemCard/>
            </li>
            <li>
                <ItemCard/>
            </li>
            <li>
                <ItemCard/>
            </li>
            <li>
                <ItemCard/>
            </li>
            <li>
                <ItemCard/>
            </li>
        </ul>
    );
}

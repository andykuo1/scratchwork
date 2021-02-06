import React, { useState } from 'react';

function createMousePosition()
{
    return {
        x: 0,
        y: 0,
    };
}

export function usePolledMouse()
{
    const [pos, setPos] = useState(createMousePosition());
    const [prev, setPrev] = useState(createMousePosition());
    return {
        pos, setPos,
        prev, setPrev,
    };
}

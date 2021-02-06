import React, { useEffect, useRef } from 'react';

export function SharedCanvas(props)
{
    const canvasRef = useRef();

    function onAnimationFrame()
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    useEffect(() => {
        let handle;
        const callback = () => {
            handle = requestAnimationFrame(callback);
            onAnimationFrame();
        };
        callback();
        return () => {
            cancelAnimationFrame(handle);
        };
    });

    return (
        <canvas ref={canvasRef}></canvas>
    );
}

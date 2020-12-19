import React, { useEffect, useRef } from 'react';

const PUPIL_RADIUS = 12;
const PUPIL_DIAMETER = PUPIL_RADIUS * 2;
const EYE_RADIUS = 32;
const EYE_DIAMETER = EYE_RADIUS * 2;

export function Eyeball()
{
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let lookX = 0;
        let lookY = 0;

        function onMouseMove(e)
        {
            lookX = (e.clientX / window.innerWidth) * 2 - 1;
            lookY = (e.clientY / window.innerHeight) * 2 - 1;
            lookX = Math.floor(lookX * EYE_DIAMETER) / EYE_DIAMETER;
            lookY = Math.floor(lookY * EYE_DIAMETER) / EYE_DIAMETER;
        }

        document.addEventListener('mousemove', onMouseMove);

        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        let animationFrameHandle = null;
        function onAnimationFrame()
        {
            animationFrameHandle = requestAnimationFrame(onAnimationFrame);

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, halfWidth * 2, halfHeight * 2);
            ctx.fillStyle = 'white';
            ctx.fillRect(
                (lookX + 1) * halfWidth - PUPIL_RADIUS,
                (lookY + 1) * halfHeight - PUPIL_RADIUS,
                PUPIL_DIAMETER,
                PUPIL_DIAMETER);
            ctx.fillText(lookY, 8, 8);
        }

        onAnimationFrame();

        return () => {
            cancelAnimationFrame(animationFrameHandle);
            document.removeEventListener('mousemove', onMouseMove);
        };
    });

    return (
        <div>
            <canvas ref={canvasRef} width={EYE_DIAMETER} height={EYE_DIAMETER}></canvas>
        </div>
    );
}

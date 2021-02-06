import React, { useEffect, useRef } from 'react';
import Style from './App.module.css';

export function App()
{
    return (
        <Providers>
            <Content/>
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

export function Content()
{
    const canvasRef = useRef();
    const controllerRef = useRef();

    useEffect(() => {
        if (!controllerRef.current)
        {
            controllerRef.current = new PainterCanvas(canvasRef.current);
        }
        return () => {

        };
    });

    return (
        <>
        <canvas ref={canvasRef}></canvas>
        </>
    );
}

class Painter
{
    constructor(canvas)
    {
        this.prevPaintPoint = { x: 0, y: 0 };
        this.paintPoints = [];
        this.painting = false;

        this.brushColor = '#ffffff';
        
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown(e)
    {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.beginPaint(x, y);
    }

    onMouseUp(e)
    {
        this.endPaint();
    }

    onMouseMove(e)
    {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.moveTo(x, y);
    }

    setBrushColor(color)
    {
        this.brushColor = color;
        return this;
    }

    moveTo(x, y)
    {
        if (this.painting)
        {
            this.paintPoints.push({ x, y });
        }
    }

    beginPaint(x, y)
    {
        this.painting = true;
        this.paintPoints.push({ x, y });
        this.prevPaintPoint.x = x;
        this.prevPaintPoint.y = y;
    }

    endPaint()
    {
        this.painting = false;
        this.paintPoints.length = 0;
    }

    updatePaint(ctx)
    {
        if (this.painting)
        {
            if (this.paintPoints.length > 0)
            {
                ctx.strokeStyle = this.brushColor;
                ctx.lineWidth = 4;

                let prev = this.prevPaintPoint;
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                for(let paintPoint of this.paintPoints)
                {
                    ctx.lineTo(paintPoint.x, paintPoint.y);
                    prev.x = paintPoint.x;
                    prev.y = paintPoint.y;
                }
                ctx.stroke();
                this.paintPoints.length = 0;
            }
        }
    }
}

class PainterCanvas
{
    constructor(canvasElement)
    {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.paintBuffer = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        this.paintCtx = this.paintBuffer.getContext('2d');
        this.painter = new Painter(canvasElement);

        this.animationFrameHandle = null;
        this.onAnimationFrame = this.onAnimationFrame.bind(this);

        requestAnimationFrame(this.onAnimationFrame);
    }

    destroy()
    {
        cancelAnimationFrame(this.animationFrameHandle);
    }

    onAnimationFrame()
    {
        this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);

        const canvas = this.canvas;
        const ctx = this.ctx;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.painter.updatePaint(this.paintCtx);

        ctx.drawImage(this.paintBuffer, 0, 0);
    }
}





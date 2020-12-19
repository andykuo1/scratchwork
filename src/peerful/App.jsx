import React, { useEffect, useRef } from 'react';
import Style from './App.module.css';

import { Eyeball } from './Eyeball.jsx';
import { PeerfulHandshakeDialog } from './PeerfulHandshake.jsx';

export function App()
{
    return (
        <div>
            <button className={Style.container}>
                Boo!
            </button>
            <Sprite src="./src/ghost.png" spriteIndex={0} spriteWidth={16} spriteHeight={16}></Sprite>
            <Eyeball/>
            <PeerfulHandshakeDialog open={true}/>
        </div>
    );
}

function Sprite(props)
{
    const { src } = props;
    const canvasRef = useRef();

    useEffect(() => {
        const image = new Image();
        image.addEventListener('load', () => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(image);
        });
        image.src = src;
    });
    return (
        <canvas ref={canvasRef}></canvas>
    );
}

/**
 * We could be a cube? Or a pigeon?
 * 
 * = Up Down Left Right =
 * Up to be tall
 * Down to be flat
 * Left to face left
 * Double Left is to lean left
 * Right to face Right
 * Double Right is to lean right
 * 
 * Up + L/R is to be tall and face that direction + lean
 * Down + L/R is to be flat and face that direction + lean
 * 
 * The eyes follow the mouse (or disabled in options).
 * 
 * There should be a sleep mode from inactivity, where it puts your
 * avatar to sleep. This is a way to hide your avatar from tracking
 * your mouse (should this be a button?). It's also a AFK mode.
 * 
 * If the avatar user is not connected in the room, but has joined,
 * they can show up as sleeping outside of the window (with Zzz's coming out).
 * 
 * Avatar tabs should be grouped by side and can also be dragged and moved. This
 * allows groups and sides to form.
 * 
 * There should be a Leader (and proxy leaders, if someone can't host, but
 * needs authority).
 * 
 * They should be able to change nicknames (with a label of "AKA <real name>")
 * 
 * There will be pokes. Thumbs Up? Down? Raise hand?
 * 
 * Emotes (up to 5 hotkeyed?)
 * Costumes
 */
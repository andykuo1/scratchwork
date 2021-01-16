import React, { useCallback, useEffect, useState } from 'react';
import Style from './Cursor.module.css';

import { useRemoteDataReceiver, useRemoteDataSender } from './Session.jsx';

export function RemoteCursor(props)
{
    const { peerId } = props;

    const { receive } = useRemoteDataReceiver(peerId, 'cursorPos');
    const { x = 0, y = 0 } = receive() || {};

    return (
        <Cursor x={x} y={y}/>
    );
}

export function LocalCursor(props)
{
    const { peerId } = props;

    const [{x, y}, setPos] = useState({ x: 0, y: 0 });
    const { send } = useRemoteDataSender(peerId, 'cursorPos');

    const onMouseMove = useCallback(e => {
        const pos = { x: e.clientX, y: e.clientY };
        setPos(pos);
        send(pos);
    }, [ send ]);

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    },
    [ onMouseMove ]);
    
    return (
        <Cursor x={x} y={y}/>
    );
}

function Cursor(props)
{
    const { x, y } = props;
    return (
        <div className={Style.container} style={{ left: x, top: y }}>
        </div>
    );
}

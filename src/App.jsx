import React from 'react';
import Style from './App.module.css';

import { RemoteCursor, LocalCursor } from './Cursor.jsx';
import { PeerProvider } from './PeerContext.jsx'
import { SessionProvider, useSession } from './Session.jsx';

import { SessionHandshake } from './SessionHandshake.jsx';
import { SharedCanvas } from './SharedCanvas.jsx';
import { UserBadge } from './UserBadge.jsx';

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
        <PeerProvider>
            <SessionProvider>
                {children}
            </SessionProvider>
        </PeerProvider>
    );
}

export function Content()
{
    const { localId, remoteIds } = useSession();
    return (
        <>
        <nav>
            <SessionHandshake/>
            <UserBadge/>
        </nav>
        <main className={Style.container}>
            {remoteIds.map(remoteId => <RemoteCursor key={remoteId} peerId={remoteId}/>)}
            <LocalCursor peerId={localId}/>
            <SharedCanvas/>
        </main>
        </>
    );
}

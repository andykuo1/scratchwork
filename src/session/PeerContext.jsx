import React, { useContext, useEffect, useState } from 'react';
import Peer from 'peerjs';

const PeerContext = React.createContext(null);
const PEER = new Peer();

export function PeerProvider(props)
{
    const { children } = props;

    const [peerId, setPeerId] = useState();

    useEffect(() => {
        PEER.on('open', setPeerId);
        return () => {
            PEER.off('open', setPeerId);
        };
    },
    [ PEER ]);

    const api = {
        peer: PEER,
        peerId,
    };
    return (
        <PeerContext.Provider value={api}>
            {children}
        </PeerContext.Provider>
    );
}

export function usePeer() {
    const api = useContext(PeerContext);
    if (!api)
    {
        throw new Error('Using context without proper parent PeerProvider.');
    }
    return api;
};

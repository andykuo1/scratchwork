import React, { useCallback, useContext, useEffect, useState } from 'react';

import { usePeer } from './PeerContext.jsx';

const SessionContext = React.createContext(null);

function createConnection(connection, peerId, updateCallback)
{
    connection.on('error', () => updateCallback(({ [peerId]: _, ...prev }) => prev));
    connection.on('close', () => updateCallback(({ [peerId]: _, ...prev }) => prev));
    updateCallback(prev => ({
        ...prev,
        [peerId]: connection
    }));
}

export function SessionProvider(props)
{
    const { children } = props;

    const { peer, peerId } = usePeer();
    const [connections, setConnections] = useState({});
    const [reliables, setReliables] = useState({});

    const establishConnection = useCallback(remoteId => {
        if (remoteId in connections) return; // Already established.

        const conn = peer.connect(remoteId);
        createConnection(conn, remoteId, setConnections);
        console.log('Established data connection...');

        const reliable = peer.connect(remoteId, { reliable: true });
        createConnection(reliable, remoteId, setReliables);
        console.log('Established reliable connection...');
    }, [ connections ]);

    const onConnection = useCallback(conn => {
        if (!conn.reliable) {
            createConnection(conn, conn.peer, setConnections);
            console.log('Received data connection...');
        } else {
            createConnection(conn, conn.peer, setReliables);
            console.log('Received reliable connection...');
        }
    });

    useEffect(() => {
        peer.on('connection', onConnection);
        return () => {
            peer.off('connection', onConnection);
        };
    }, 
    [ peerId ]);

    const api = {
        localId: peerId,
        remoteIds: Object.keys(connections),
        connections,
        reliables,
        establishConnection,
    };
    return (
        <SessionContext.Provider value={api}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession()
{
    const api = useContext(SessionContext);
    if (!api) throw new Error('Missing parent context provider.');
    return api;
}

export function useRemoteDataReceiver(remotePeerId, dataKey, opts = {})
{
    const { connections } = useSession();
    const [value, setValue] = useState(null);
    
    useEffect(() => {
        const remoteDataCallback = ({ key, value }) => {
            if (key === dataKey) setValue(value);
        };
        const remoteConnection = connections[remotePeerId];    
        if (remoteConnection)
        {
            remoteConnection.on('data', remoteDataCallback);
            return () => {
                remoteConnection.off('data', remoteDataCallback);
            };
        }
    },
    [ dataKey, remotePeerId ]);

    const receiveCallback = useCallback(() => value, [ value ]);

    return {
        receive: receiveCallback
    };
}

export function useRemoteDataSender(localPeerId, dataKey, opts = {})
{
    const { connections } = useSession();

    return {
        send: (value) => {
            for(let connection of Object.values(connections))
            {
                connection.send({
                    key: dataKey,
                    value: value,
                });
            }
        },
    };
}

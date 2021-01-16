import React, { useCallback, useState } from 'react';
import Style from './SessionHandshake.module.css';

import { pasteTextFromClipboard } from './ClipboardHelper.js';
import { useSession } from './Session.jsx';

const MAX_USER_ID_LENGTH = 16;

export function SessionHandshake()
{
    const { establishConnection } = useSession();
    
    const [joinId, setJoinId] = useState('');
    const [pasted, setPasted] = useState(false);

    const onPaste = useCallback(async () => {
        let text = await pasteTextFromClipboard();
        setJoinId(text);
        setPasted(true);
    }, []);

    const onConnect = useCallback(() => {
        establishConnection(joinId);
    }, [ joinId ]);

    return (
        <fieldset className={Style.container}>
            <button className={Style.connectButton} disabled={!joinId} onClick={() => onConnect()}>Connect</button>
            <input maxLength={MAX_USER_ID_LENGTH} value={joinId} onChange={setJoinId}/>
            <button className={Style.idButton}
                title="Paste from clipboard"
                disabled={joinId}
                onClick={onPaste}>
                {pasted ? 'Pasted!' : 'Paste'}
            </button>
        </fieldset>
    );
}

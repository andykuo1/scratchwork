import React, { useCallback, useState } from 'react';
import Style from './UserBadge.module.css';

import { usePeer } from './PeerContext.jsx';
import { copyTextToClipboard } from './ClipboardHelper.js';

export function UserBadge()
{
    const { peerId } = usePeer();

    const [copied, setCopied] = useState(false);

    const onCopy = useCallback(() => {
        copyTextToClipboard(peerId);
        setCopied(true);
    },
    [peerId]);

    return (
        <fieldset className={Style.container}>
            <label className={Style.idLabel}>ID#</label>
            <output>{peerId}</output>
            <button className={Style.idButton}
                title="Copy to clipboard"
                disabled={!peerId}
                onClick={onCopy}>
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </fieldset>
    );
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Style from './PeerfulHandshakeDialog.module.css';

import * as peerful from './peerful.js';

import { HistoryProvider, useHistory } from './HistoryContext.jsx';

const STAGES = {
    'intro': IntroStage,
    'host1': HostStage1,
    'host2': HostStage2,
    'join1': JoinStage1,
    'join2': JoinStage2,
    'outro': OutroStage,
};

export function PeerfulHandshakeDialog(props)
{
    const { open } = props;
    const handshakeRef = useRef(null);

    return (
        <dialog className={Style.container} open={open}>
            <HistoryProvider>
                <Handshake handshakeRef={handshakeRef}>
                </Handshake>
            </HistoryProvider>
        </dialog>
    );
}

function Handshake(props)
{
    const { handshakeRef } = props;
    const history = useHistory();

    const onBack = useCallback(() => {
        history.prev();
    });

    const onNext = useCallback(() => {
        history.next();
    });

    const onCancel = useCallback(() => {
        history.clear();
    });

    // Initialize history, if it hasn't started yet.
    useEffect(() => {
        if (!history.current)
        {
            history.next('intro');
        }
    });

    return (
        <div className={Style.container}>
            <div className={Style.stageList}>
                {
                    history.list.map(key => {
                        const Stage = STAGES[key];
                        return <Stage name={key} key={key} handshakeRef={handshakeRef}></Stage>;
                    })
                }
            </div>
            <nav>
                <button className={Style.back}
                    disabled={!history.hasPrev()}
                    onClick={onBack}>
                    Back
                </button>
                <button className={Style.cancel}
                    onClick={onCancel}>
                    Cancel
                </button>
                <button className={Style.next + (history.current !== 'intro' ? ` ${Style.pending}` : '')}
                    disabled={!history.hasNext() || history.current === 'intro'}
                    onClick={onNext}>
                    {history.current === 'intro'
                        ? 'Start'
                        : history.current === 'outro'
                            ? 'Finish'
                            : 'Next'}
                </button>
            </nav>
        </div>
    );
}

function HandshakeStage(props)
{
    const { name, children } = props;

    const history = useHistory();
    const focus = history.current === name;
    const prev = history.get(-1) === name;
    const next = history.get(1) === name;

    return (
        <section className={Style.stageContainer
            + (focus ? ` ${Style.focus}` : '')
            + (prev ? ` ${Style.prev}` : '')
            + (next ? ` ${Style.next}` : '')}>
            {children}
        </section>
    );
}

function IntroStage(props)
{
    const { name } = props;
    const history = useHistory();
    return (
        <HandshakeStage name={name}>
            <div className={Style.pillContainer}>
                <button className={Style.redPill}
                    onClick={() => history.next('host1')}>
                    Invite
                </button>
                <button className={Style.bluePill}
                    onClick={() => history.next('join1')}>
                    Join
                </button>
            </div>
        </HandshakeStage>
    );
}

function HostStage1(props)
{
    const { name, handshakeRef } = props;

    const history = useHistory();
    const offerRef = useRef();
    const onCopy = useCallback(() => {
        copyTextToClipboard(offerRef.current.value);
    });
    useEffect(() => {
        if (!handshakeRef.current)
        {
            peerful.offerHandshake()
                .then(handshake => {
                    offerRef.current.value = JSON.stringify(handshake.offer);
                    handshakeRef.current = handshake;
                    history.set(1, 'host2');
                });
        }
    });
    return (
        <HandshakeStage name={name}>
            <h2>Send Offer</h2>
            <fieldset>
                <output>
                    <input ref={offerRef} type="text" readOnly/>
                    <button onClick={onCopy}>Copy</button>
                </output>
                <p>Copy and give the code to them to paste and join.</p>
            </fieldset>
        </HandshakeStage>
    );
}

function HostStage2(props)
{
    const { name, handshakeRef } = props;
    const history = useHistory();
    const answerRef = useRef();
    const [canStart, setCanStart] = useState(false);
    const onPaste = useCallback(() => {
        pasteTextFromClipboard(answerRef.current);
    });
    const onChange = useCallback(e => {
        setCanStart(Boolean(e.target.value));
    });
    const onStart = useCallback(() => {
        // TODO: Do actual connections.
        history.set(1, 'outro');
    });
    const onTest = useCallback(() => {
        peerful.answerHandshake(handshakeRef.current.offer)
            .then(handshake => {
                answerRef.current.value = handshakeRef.current.answer;
            });
    });
    return (
        <HandshakeStage name={name}>
            <h2>Request Answer</h2>
            <fieldset>
                <p>Ask for the answer code from them to paste and accept.</p>
                <input ref={answerRef}
                    type="text"
                    placeholder="Answer Code"
                    onChange={onChange}/>
                <button onClick={onPaste}>Paste</button>
                <button onClick={onStart} disabled={canStart}>Start Session</button>
                <hr/>
                <button onClick={onTest}>Local Test</button>
            </fieldset>
        </HandshakeStage>
    );
}

function JoinStage1(props)
{
    const { name, handshakeRef } = props;
    const history = useHistory();
    const [canJoin, setCanJoin] = useState();
    const offerRef = useRef();
    const onPaste = useCallback(() => {
        pasteTextFromClipboard(offerRef.current);
    });
    const onChange = useCallback(e => {
        setCanJoin(Boolean(e.target.value));
    });
    const onJoin = useCallback(() => {
        let remoteData = JSON.parse(offerRef.current.value);
        peerful.answerHandshake(remoteData)
            .then(handshake => {
                handshakeRef.current = handshake;
                history.set(1, 'join2');
            });
    });
    return (
        <HandshakeStage name={name}>
            <h2>Request Offer</h2>
            <fieldset>
                <p>Ask for the offer code from them to paste and join.</p>
                <input ref={offerRef}
                    type="text"
                    placeholder="Offer Code"
                    onChange={onChange}/>
                <button onClick={onPaste}>Paste</button>
                <button onClick={onJoin} disabled={canJoin}>Join</button>
            </fieldset>
        </HandshakeStage>
    );
}

function JoinStage2(props)
{
    const { name, handshakeRef } = props;
    const history = useHistory();
    const answerRef = useRef();
    const onCopy = useCallback(() => {
        copyTextToClipboard(answerRef.current.value);
    });
    useEffect(() => {
        if (history.current === name && !history.hasNext())
        {
            history.set(1, 'outro');
            answerRef.current.value = handshakeRef.current.answer;
        }
    });
    return (
        <HandshakeStage name={name}>
            <h2>Send Answer</h2>
            <fieldset>
                <input ref={answerRef} type="text" readOnly/>
                <button onClick={onCopy}>Copy</button>
                <p>Copy and give this to them to paste and accept.</p>
            </fieldset>
        </HandshakeStage>
    );
}

function OutroStage(props)
{
    const { name } = props;
    const history = useHistory();
    return (
        <HandshakeStage name={name}>
            <h2>Connection established!</h2>
        </HandshakeStage>
    );
}

async function copyTextToClipboard(value)
{
    await navigator.clipboard.writeText(value);
}

async function pasteTextFromClipboard(element)
{
    let text = await navigator.clipboard.readText();
    element.value = text;
}

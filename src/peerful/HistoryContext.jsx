import React, { useState, useContext } from 'react';

const HistoryContext = React.createContext(null);

function createHistorySnapshot(data)
{
    return data;
}

function defaultSnapshotComparator(a, b)
{
    return a === b ? 0 : -1;
}

export function HistoryProvider(props)
{
    const { snapshotComparator = defaultSnapshotComparator, children } = props;
    const [state, setState] = useState({
        history: [],
        index: -1,
    });
    const api = {
        list: state.history,
        current: state.history.length > 0
            ? state.history[state.index]
            : null,
        resetState: setState,
        push(target)
        {
            setState(state => {
                const { history, index } = state;
                let snapshot = createHistorySnapshot(target);
                let next = history.slice();
                next.push(snapshot);
                return { history: next, index };
            });
        },
        next(target = undefined, force = false)
        {
            setState(state => {
                const { history, index } = state;
                if (typeof target !== 'undefined')
                {
                    // Create new history...
                    if (index + 1 >= history.length)
                    {
                        let snapshot = createHistorySnapshot(target);
                        let next = history.slice();
                        next.push(snapshot);
                        return { history: next, index: next.length - 1 };
                    }
                    // Continue through existing history...
                    else if (!force && snapshotComparator(target, history[index + 1]) === 0)
                    {
                        return { history, index: index + 1 };
                    }
                    // Restart history from here...
                    else
                    {
                        let snapshot = createHistorySnapshot(target);
                        let next = history.slice(0, index + 1);
                        next.push(snapshot);
                        return { history: next, index: next.length - 1 };
                    }
                }
                else
                {
                    let nextIndex = index + 1;
                    if (nextIndex < history.length)
                    {
                        return { history, index: nextIndex };
                    }
                    else
                    {
                        return state;
                    }
                }
            });
        },
        prev()
        {
            setState(state => {
                const { history, index } = state;
                let prevIndex = index - 1;
                if (prevIndex >= 0 && history.length > 0)
                {
                    return { history, index: prevIndex };
                }
                else
                {
                    return state;
                }
            });
        },
        set(offset, target)
        {
            setState(state => {
                const { history, index } = state;
                let nextIndex = index + offset;
                if (nextIndex >= 0)
                {
                    if (nextIndex >= history.length)
                    {
                        let snapshot = createHistorySnapshot(target);
                        let next = history.slice();
                        next.push(snapshot);
                        return { history: next, index };
                    }
                    else
                    {
                        let snapshot = createHistorySnapshot(target);
                        let next = history.slice();
                        history[nextIndex] = snapshot;
                        return { history: next, index };
                    }
                }
                else
                {
                    return state;
                }
            });
        },
        get(offset = 0)
        {
            const { history, index } = state;
            if (history.length > 0)
            {
                return history[Math.min(Math.max(index + offset, 0), history.length - 1)];
            }
            else
            {
                return null;
            }
        },
        clear()
        {
            setState(state => {
                const { history } = state;
                if (history.length > 0)
                {
                    return { history: [], index: -1 };
                }
                else
                {
                    return state;
                }
            });
        },
        hasNext()
        {
            return state.index < state.history.length - 1;
        },
        hasPrev()
        {
            return state.index > 0 && state.history.length > 0;
        },
    };
    return (
        <HistoryContext.Provider value={api}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory()
{
    const context = useContext(HistoryContext);
    if (!context) throw new Error('Missing context provider.');
    return context;
}

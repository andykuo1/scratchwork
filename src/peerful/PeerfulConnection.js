import { PeerfulHandshake } from './peerful.js';

export class PeerfulConnection
{
    /**
     * @param {PeerfulHandshake} handshake
     */
    constructor(handshake)
    {
        this.connection = handshake.connection;
        // Assumes at least 2 channels: data and reliable.
        this.channels = handshake.channels;
        this.remote = handshake.remote;

        this.onRemoteOpen = this.onRemoteOpen.bind(this);
        this.onRemoteClose = this.onRemoteClose.bind(this);
        this.onRemoteData = this.onRemoteData.bind(this);
        this.onRemoteReliable = this.onRemoteReliable.bind(this);

        // Set up
        this.channels.reliable.addEventListener('open', this.onRemoteOpen);
        this.channels.reliable.addEventListener('close', this.onRemoteClose);
        this.channels.data.addEventListener('close', this.onRemoteClose);

        // Event listeners
        this.listeners = {};
    }

    emit(event, ...args)
    {
        if (event in this.listeners)
        {
            for(let listener of this.listeners[event])
            {
                listener(...args);
            }
        }
    }

    on(event, callback)
    {
        if (event in this.listeners)
        {
            this.listeners[event].push(callback);
        }
        else
        {
            this.listeners[event] = [callback];
        }
    }
    
    off(event, callback)
    {
        if (event in this.listeners)
        {
            let i = this.listeners[event].indexOf(callback);
            if (i >= 0)
            {
                this.listeners[event].splice(i, 1);
            }
        }
    }

    once(event, callback)
    {
        let wrappedCallback = () => {
            callback();
            this.off(event, wrappedCallback);
        };
        this.on(event, wrappedCallback);
    }

    close()
    {
        this.channels.reliable.send('close');

        this.connection.close();
        for(let channelLabel of Object.keys(this.channels))
        {
            this.channels[channelLabel].close();
        }
    }

    send(data)
    {
        this.channels.data.send(data);
    }

    /** @private */
    onRemoteData(e)
    {
        this.emit('data', e.data, this);
    }

    /** @private */
    onRemoteReliable(e)
    {
        switch(e)
        {
            // Remote-side only
            case 'open':
                this.emit('open', this);
                break;
            // Either side is possible
            case 'close':
                this.emit('close', this);
                break;
        }
    }

    /** @private */
    onRemoteOpen()
    {
        this.channels.data.addEventListener('message', this.onRemoteData);
        this.channels.reliable.addEventListener('message', this.onRemoteReliable);

        if (!this.remote)
        {
            this.channels.reliable.send('open');
        }
    }

    /** @private */
    onRemoteClose()
    {
        console.error('Connection closed remotely.');

        this.channels.data.removeEventListener('message', this.onRemoteData);
        this.channels.reliable.removeEventListener('message', this.onRemoteReliable);
        this.channels.reliable.removeEventListener('open', this.onRemoteOpen);
        this.channels.reliable.removeEventListener('close', this.onRemoteClose);

        this.connection.close();
        for(let channelLabel of Object.keys(this.channels))
        {
            this.channels[channelLabel].close();
        }
    }
}

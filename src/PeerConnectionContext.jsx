import { useEffect, useState } from "react";
import { usePeer } from "./PeerContext";

export function usePeerConnection(props)
{
    const { joinId } = props;
    const { peer } = usePeer();

    const [connection, setConnection] = useState();

    useEffect(() => {
        if (joinId)
        {
            setConnection(peer.connect(joinId));
        }
        return () => {
            conn.close();
        };
    }, [ joinId ]);


}

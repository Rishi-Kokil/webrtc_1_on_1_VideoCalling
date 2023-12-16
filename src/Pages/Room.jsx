import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import ReactPlayer from "react-player";

function Room() {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null)

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log("New User Joined " + email + " " + id);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        // we will start our media devices to get audio and video
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);

        // we are using a package known as react player to play our audio and video

    }, [])

    useEffect(() => {
        console.log(socket);
        socket.on("user:joined", handleUserJoined);

        return () => {
            socket.off("user:joined", handleUserJoined);
        }
    }, [socket, handleUserJoined])

    return (
        <div className='text-center max-w-7xl mx-auto mt-3'>
            <h1>Room Page</h1>
            <h3>{remoteSocketId ? 'Connected' : 'No One in the Room'}</h3>

            <button
                className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl'
                onClick={handleCallUser}
            >Call User
            </button>

            {
                myStream
                &&
                <ReactPlayer url={myStream} />
                // <ReactPlayer playing controls stopOnUnmount
                //     className={'w-[300px] h-[200px]'}
                //     url={myStream} />
            }

        </div>
    );
}

export default Room;
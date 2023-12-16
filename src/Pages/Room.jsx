import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import ReactPlayer from "react-player";
import peer from '../Service/Peers';

function Room() {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null)

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log("New User Joined " + email + " " + id);

        // this is the socket id of the new user that has joined
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        // we will start our media devices to get audio and video
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        // we are using a package known as react player to play our audio and video

        //we are creating an offer which is basically our own ip address and sending it 
        // // to the Peer which is connected inside the same room

        const offer = await peer.getOffer();
        // console.log("offer : " , offer);
        socket.emit("outgoing:call" , {to : remoteSocketId , offer})

    }, [socket , remoteSocketId]);

    const handleIncomingCall = useCallback(async ({from , offer})=>{
        setRemoteSocketId(from)
        console.log(`Incomming Call From : ${from}`);
        console.log(offer);
        // start the stram of our user
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);

        // we will need to send back our answer
        const ans = await peer.getAnswer(offer);
        console.log("Call Accepting : we sending answer");
        console.log(ans); 

        socket.emit("call:accepted" , {to : from , ans})

    } , [socket]);

    const handleAcceptedCall = useCallback(async ({from , ans})=>{
        peer.setLocalDescription(ans);
    } , [socket]);


    useEffect(() => {
        console.log(socket);
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call" , handleIncomingCall);
        socket.on("call:accepted" , handleAcceptedCall);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call" , handleIncomingCall);
            socket.off("call:accepted" , handleAcceptedCall);
        }
    }, [socket, handleUserJoined , handleIncomingCall])

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
                // <ReactPlayer url={myStream} />
                <ReactPlayer playing controls stopOnUnmount
                    className={'w-[300px] h-[200px]'}
                    url={myStream} />
            }

        </div>
    );
}

export default Room;
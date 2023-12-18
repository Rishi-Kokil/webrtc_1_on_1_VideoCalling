import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import ReactPlayer from "react-player";
import peer from '../Service/Peers';

function Room() {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null);

    const sendStream = useCallback(() => {
        myStream.getTracks().forEach((track) => {
            console.log("Adding Streams");
            peer.peer.addTrack(track, myStream);
        });
    }, [myStream]);

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
        //to the Peer which is connected inside the same room

        const offer = await peer.getOffer();
        // console.log("offer : " , offer);
        socket.emit("outgoing:call", { to: remoteSocketId, offer })

    }, [socket, remoteSocketId]);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
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

        socket.emit("call:accepted", { to: from, ans })

    }, [socket]);

    const handleAcceptedCall = useCallback(async ({ from, ans }) => {
        console.log(ans);
        peer.setLocalDescription(ans);
        sendStream();

    }, [socket, sendStream]);

    const handleNegotiation = useCallback(() => async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { to: remoteSocketId, offer });
    }, []);

    const handleNegotiationIncoming = useCallback(({ from, offer }) => {
        const ans = peer.getAnswer();
        socket.emit('peer:nego:completed', { to: from, ans });

    }, []);

    const handleNegotiationCompleted = useCallback(async ({ from, ans }) => {
        await peer.setLocalDescription(ans);

    }, []);

    // Negitiation will be needed When we Connect two Devices 
    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegotiation);

        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
        }
    }, [handleNegotiation]);

    const handleTrack = async e => {
        console.log("Got Tracks");
        const tempStream = e.streams;
        setRemoteStream(tempStream);
    };

    useEffect(() => {
        peer.peer.addEventListener('track', handleTrack);

        return () => {
            //De Register an Event Listener
            peer.peer.removeEventListener('track', handleTrack);
        }
    }, [myStream, handleTrack]);

    useEffect(() => {
        console.log(socket);
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleAcceptedCall);
        socket.on("peer:nego:needed", handleNegotiationIncoming);
        socket.on("peer:nego:completed", handleNegotiationCompleted);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegotiationIncoming);
            socket.off("peer:nego:completed", handleNegotiationCompleted);
        }
    }, [socket, handleUserJoined, handleIncomingCall, handleNegotiationIncoming, handleNegotiationCompleted]);

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
                <button
                    onClick={sendStream}
                >Send Stream</button>

            }

            {
                myStream
                &&
                <div>
                    <h3>Our Video</h3>
                    // <ReactPlayer url={myStream} />
                    <ReactPlayer playing controls
                        className={'w-[200px] h-[100px]'}
                        url={myStream} />
                </div>

            }

            {
                remoteStream
                &&
                <div>
                    <h4>Video Of Other User</h4>
                    <ReactPlayer playing controls
                        className={'w-[400px] h-[300px]'}
                        url={remoteStream} />
                </div>
                // <ReactPlayer url={myStream} />

            }


        </div>
    );
}

export default Room;
import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../Providers/Socket';
import ReactPlayer from "react-player";
import peer from '../Service/Peers';
import { Navbar } from '../Components';
import { audio, audioDisabled, video, videoDisabled } from '../assests';

function Room() {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const sendStream = useCallback(() => {
        myStream.getTracks().forEach((track) => {
            console.log("Adding Streams");
            peer.peer.addTrack(track, myStream);
        });

    }, [myStream, peer.peer]);

    const handleTrack = e => {
        console.log("Got Tracks");
        const stream = e.streams;
        setRemoteStream(stream[0]);
    };

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log("New User Joined " + email + " " + id);
        // this is the socket id of the new user that has joined
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        // we are using a package known as react player to play our audio and video

        //we are creating an offer which is basically our own ip address and sending it 
        //to the Peer which is connected inside the same room

        const offer = await peer.getOffer();
        // console.log("offer : " , offer);
        socket.emit("outgoing:call", { to: remoteSocketId, offer });

    }, [socket, remoteSocketId]);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        console.log(`Incomming Call From : ${from}`);
        console.log(offer);
        // start the stram of our user
        // const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        // setMyStream(stream);

        // we will need to send back our answer
        const ans = await peer.getAnswer(offer);
        console.log("Call Accepting : we sending answer");
        console.log(ans);

        socket.emit("call:accepted", { to: from, ans })

    }, [socket]);

    const handleResponse = useCallback(() => {
        sendStream();
    }, [])

    const handleAcceptedCall = useCallback(({ from, ans }) => {
        peer.setLocalDescription(ans);
        console.log('We Recieved Call Accepted Message');
        console.log(ans);
    }, [peer]);

    const handleNegotiation = useCallback(async () => {
        console.log("Negotiation Started");
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { to: remoteSocketId, offer });
    }, []);

    const handleNegotiationIncoming = useCallback(async ({ from, offer }) => {
        console.log("Negotiation Handling");
        const ans = await peer.getAnswer(offer);
        socket.emit('peer:nego:completed', { to: from, ans });

    }, []);

    const handleNegotiationCompleted = useCallback(async ({ from, ans }) => {
        await peer.setLocalDescription(ans);
        console.log("Negotiation Completed Sending Streams");
        socket.emit('peer:nego:completed:response', { to: from });
        sendStream();
    }, []);



    // Negitiation will be needed When we Connect two Devices 
    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegotiation)

        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
        }
    }, [peer.peer, handleNegotiation]);

    useEffect(() => {
        peer.peer.addEventListener('track', handleTrack);

        return () => {
            // De-register the event listener
            peer.peer.removeEventListener('track', handleTrack);
        };
    }, [handleTrack, peer.peer]);



    const startMedia = async () => {
        console.log("Media Started");
        try {
            const defaultStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setMyStream(defaultStream);

        } catch (error) {
            console.error('Error accessing user media:', error);
        }
    }

    useEffect(() => {
        startMedia();
    }, [])

    useEffect(() => {
        console.log(socket);
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("accepted:response", handleAcceptedCall);
        socket.on("peer:nego:needed", handleNegotiationIncoming);
        socket.on("peer:nego:completed", handleNegotiationCompleted);
        socket.on("peer:nego:completed:response", handleResponse);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("accepted:response", handleAcceptedCall);
            socket.off("peer:nego:needed", handleNegotiationIncoming);
            socket.off("peer:nego:completed", handleNegotiationCompleted);
            socket.off("peer:nego:completed:response", handleResponse);
        }
    }, [handleUserJoined, handleIncomingCall, handleAcceptedCall, handleNegotiationIncoming, handleNegotiationCompleted, handleResponse]);


    return (
        <div>
            <Navbar />
            <div
                className='h-[70vh] w-[80vw] mx-auto flex justify-evenly items-center flex-wrap md:gap-3 gap-5'
            >
                <div
                    className='flex flex-grow flex-col gap-[50px] items-center'
                >
                    <h2>{remoteSocketId ? 'Connected' : 'No One in the Room'}</h2>
                    <button
                        className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl'
                        onClick={handleCallUser}
                    > Call User </button>

                </div>
                <div className='h-full border border-solid border-gray-500 md:block hidden'></div>
                <div
                    className=' h-full flex flex-grow flex-col justify-center gap-[50px] items-center bg-gray-300 rounded-lg'
                >
                    {
                        myStream
                            ? <div className='relative'>
                                <h1>Our Video</h1>
                                <ReactPlayer
                                    playing
                                    url={myStream}
                                    controls
                                    width="90%"
                                    height="90%"
                                />
                            </div>
                            : "Your Stream d will Appear here"
                    }
                </div>
                <div
                    className='h-full flex flex-grow flex-col justify-center gap-[50px] items-center bg-gray-300 rounded-lg'
                >
                    {
                        remoteStream
                        &&
                        <div>
                            <h4>Video Of Other User</h4>
                            <ReactPlayer playing
                                url={remoteStream}
                                controls
                                width="90%"
                                height="90%" />
                        </div>
                    }

                </div>

            </div>
        </div>
    );
}

export default Room;
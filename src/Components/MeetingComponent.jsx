import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from "../Providers/Socket"
import { useNavigate } from 'react-router-dom';

import { Hero, Navbar } from '.';

function MeetingComponent() {
    const [email, setEmail] = useState("");
    const [createMeetEmail, setCreateMeetEmail] = useState("")
    const [roomNumber, setRoomNumber] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(email, roomNumber);
        socket.emit('join-room', { emailId: email, roomId: roomNumber, flag: true }); // basically we are activating / starting a join-room event
    }, [email, roomNumber, socket]);


    const handleJoinRoom = useCallback((data) => {
        // getting our email and socketid from Nodejs Server
        const { email, id } = data;
        console.log(data);
        navigate(`/room/${id}`);
    }, []);

    const handleCreateMeeting = useCallback(() => {
        socket.emit('join-room', { emailId: email, roomId: roomNumber, flag: false });
    }, [])


    useEffect(() => {
        socket.on('user:joined', handleJoinRoom); // whenever a room join event comes from the backend then we call the handlejoinroom function
        // socket.on is basically an event listener and so we need to close it before the 
        //page is re rendered 
        return () => {
            socket.off("user:joined", handleJoinRoom);
        }

    }, [socket, handleJoinRoom])



    return (
        <div
            className='h-[70vh] w-[80vw] mx-auto flex justify-evenly items-center flex-wrap md:gap-0 gap-3'
        >
            <div className='min-w-[380px] flex flex-grow flex-col gap-[50px] items-center'>
                <h2
                    className='text-xl'
                >Join Meeting</h2>
                <form className='flex flex-col justify-center items-center gap-[20px]' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Enter your Email here'
                        className='w-[240px] p-2 rounded-lg text-center border-0 ring-2  ring-gray-300'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type="text"
                        placeholder='Enter Room Code'
                        className=' w-[240px] p-2 rounded-lg text-center ring-2  ring-gray-300  '
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)} />

                    <button
                        className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl'
                    > Join </button>
                </form>
            </div>

            <div className='h-full border border-solid border-gray-500 md:block hidden'></div>

            <div className='min-w-[380px] flex flex-grow flex-col items-center gap-[50px]'>
                <h2
                    className='text-xl'
                >
                    Organise a Meeting
                </h2>
                <input
                    type="text"
                    onChange={(e) => { setCreateMeetEmail(e.target.value) }}
                    placeholder='Enter Email'
                    className=' w-[240px] p-2 rounded-lg text-center ring-2  ring-gray-300  '
                />
                <button
                    className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl'
                    onClick={handleCreateMeeting}
                >Create</button>
            </div>

        </div>
    )
}

export default MeetingComponent;
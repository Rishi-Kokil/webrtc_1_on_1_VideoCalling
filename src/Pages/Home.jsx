import React, { useCallback, useState } from 'react'
import { useSocket } from "../Providers/Socket"

function Homepage() {
    const [email, setEmail] = useState("");
    const [roomNumber, setRoomNumber] = useState("");

    const socket = useSocket();


    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(email, roomNumber);
        socket.emit('join-room', { roomId: roomNumber, emailId: email }); // basically we are activating / starting a join-room event
    }, [email, roomNumber, socket]);


    return (
        <div>
            <form className='mx-auto max-w-7xl h-[100vh] flex flex-col flex-wrap justify-center items-center' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Enter your Email here'
                    className='w-[240px] p-2 m-3 rounded-lg text-center border-0 ring-2  ring-gray-300'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="text"
                    placeholder='Enter Room Code'
                    className=' w-[240px] p-2 m-3 rounded-lg text-center ring-2  ring-gray-300  '
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)} />

                <button
                    className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl'
                > Join </button>
            </form>
        </div>
    )
}

export default Homepage
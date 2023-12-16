import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from "../Providers/Socket"
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const [email, setEmail] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(email, roomNumber);
        socket.emit('join-room', { emailId: email , roomId: roomNumber }); // basically we are activating / starting a join-room event
    }, [email, roomNumber, socket]);


    const handleJoinRoom = useCallback((data)=>{
        const {email , id} = data;
        console.log(data);
        navigate(`/room/${id}`);
    },[]);


    useEffect(()=>{
        socket.on('user:joined' , handleJoinRoom); // whenever a room join event comes from the backend then we call the handlejoinroom function
        // socket.on is basically an event listener and so we need to close it before the 
        //page is re rendered 
        return ()=>{
            socket.off("user:joined" , handleJoinRoom);
        }

    } , [socket ,handleJoinRoom])



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
import React from 'react'
import  { useSocket } from "../Providers/Socket"

function Homepage() {
    const { socket } = useSocket();
    socket.emit("join-room" , {roomId : "1" , emailId : "abc@ex.com"});

    return (
        <div>
            <div className='mx-auto max-w-7xl h-[100vh] flex flex-col flex-wrap justify-center items-center'>
                <input
                    type="text"
                    placeholder='Enter your Email here' 
                    className='w-[240px] p-2 m-3 rounded-lg text-center border-0 ring-2  ring-gray-300 '/>
                <input 
                type="text" 
                placeholder='Enter Room Code' 
                className=' w-[240px] p-2 m-3 rounded-lg text-center ring-2  ring-gray-300  '/>

                <button className='py-3  mt-3 bg-black text-white w-[150px] rounded-xl' >Join</button>
            </div>
        </div>
    )
}

export default Homepage
const express = require("express")

const app = express();
const { Server } = require("socket.io");

const io = new Server(8000, {
    cors: true,
});    // Create a new Server Instance 


const emaitToSocketIdMapping = new Map();
const socketIdToEmailMap = new Map();



// io.on() is handling some event with context to the socl=ket io library
io.on("connection", (socket) => { // on getting a connection request we will persome some task
    console.log("New Connection", socket.id);

    // Event Listener For Join Room Event
    socket.on("join-room", (data) => {
        const { emailId , roomId } = data; // destructuring syntax to extract room id and email id from data object
        console.log("User Email : " + emailId + " Room Id : " + roomId);

        //Storing a Mapping to Socketid and Email id
        emaitToSocketIdMapping.set(emailId, socket.id);
        socketIdToEmailMap.set(socket.id , emailId);

        socket.join(roomId); // every socket gets a unique roomid So that we can identify all the socket sitting in that particular room

        //When A use Join we need to notify the existing users
        io.to(roomId).emit("user:joined" , {email : emailId    , id : socket.id});// so we are returning the socketid through which he has joined and his email

        io.to(socket.id).emit("join-room" , data); //we are sending a join room event to all sockets with socket id 
        // basically we are recreating an event and sending it back to the front end with the data
    })
})





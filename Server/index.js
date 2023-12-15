const express = require("express")

const app = express();
const { Server } = require("socket.io");

const io = new Server(8000, {
    cors: true,
});    // Create a new Server Instance 

const emaitToSocketMapping = new Map();

// io.on() is handling some event with context to the socl=ket io library
io.on("connection", (socket) => { // on getting a connection request we will persome some task
    console.log("New Connection", socket.id);
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data; // destructuring syntax to extract room id and email id from data object
        console.log("User Email : " + emailId + " Room Id : " + roomId);
        emaitToSocketMapping.set(emailId, socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined");
    })
})





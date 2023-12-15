const express = require("express")

const app = express();
const {Server} = require("socket.io"); 

const io = new Server();    // Create a new Server Instance 

const emaitToSocketMapping = new Map();

// io.on() is handling some event with context to the socl=ket io library
io.on("connection", (socket)=>{ // on getting a connection request we will persome some task
    console.log("New Connection");
    socket.on("join-room" , (data)=>{
        console.log("User Email : " + emailId + " Room Id : " + roomId);
        const{ roomId , emailId } = data; // destructuring syntax to extract room id and email id from data object
        emaitToSocketMapping.set(emailId , socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined");
    })
})


app.listen(8000, ()=>{
    console.log("Server Running on PORT : 8000");
})

io.listen(8001); // socket server listening on port 8001


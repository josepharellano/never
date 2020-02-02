const io = require("socket.io-client");

let socket = io.connect("http://localhost:3000");

console.log("Connecting");
socket.on('connect', ()=>{
    console.log("Connected to Server");
});

socket.on('disconnect', ()=>{
    console.log("Disconnected from Server");
})

socket.emit("Event","blah");

socket.on('GameUpdate',(entities)=>{
    console.log("Update");
    console.log(entities);
})
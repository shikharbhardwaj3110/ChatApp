const express = require('express')
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+ '/index.html')
})

io.on('connection', (socket) => {

  socket.broadcast.emit('miscmsg',{id : socket.id, flag : 1})

  socket.on('chat msg',(data)=>{
      socket.broadcast.emit('chat msg',{id : socket.id, data : data})
  })  

  console.log('A user connected');

  socket.send("Welcome !")

  socket.on('disconnect',()=>{
      socket.broadcast.emit('miscmsg',{flag : 0,id : socket.id})
  })
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});
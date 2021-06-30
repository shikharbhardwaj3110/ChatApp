const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  socket.broadcast.emit('miscmsg',"A user has joined the chat !")
  socket.on('chat msg',(data)=>{
      console.log("Data recvd from client : ",data)
      socket.broadcast.emit('chat msg',data)
  })  

  console.log('a user connected');

  socket.send("Welcome !")

  socket.on('disconnect',()=>{
      socket.broadcast.emit('miscmsg',"A user has left the chat !")
      console.log('a user disconnected')
  })
  

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
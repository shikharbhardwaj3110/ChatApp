const express = require('express')
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var usernames = []

app.use(express.static(__dirname + '/public'));

app.get('/chatroom',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
})

app.get('/',(req,res)=>{
  res.sendFile(__dirname+ '/landing.html')
})

io.on('connection', (socket) => {

  socket.on('saveClient',(data)=>{
    console.log("Username received : ",data.username)

    flag=0
    usernames.forEach(element => {
      if(data.username==element.username)
        flag=1
    });

    if(!flag){
      var obj = new Object()
      obj.username = data.username
      obj.socketId = socket.id
      usernames.push(obj)
      socket.send({flag : socket.id})
      console.log(usernames)
    }
    else
      socket.send({flag : 0})
  })

  socket.on('verifyClient',(data)=>{
    var flag=0
    var confirmUsername 
    usernames.forEach(element=>{
      if(data==element.socketId)
      {
        flag=1
        confirmUsername = element.username
      }
    })
    if(flag){
      socket.emit('confirmClient',1)
      socket.broadcast.emit('miscmsg',{id : confirmUsername, conf : 1})
    }
    else
      socket.emit('confirmClient',0)
  })

  socket.on('chat msg',(data)=>{
      console.log("Message recvd from : ",data.sid, + "message : ",data.inputValue)
      var clientname
      usernames.forEach(element=>{
        if(data.sid==element.socketId)
          clientname = element.username
      })
      socket.broadcast.emit('chat msg',{id : clientname, data : data.inputValue})
  })  


  console.log('A user connected');

  socket.on('disconnect',() =>{
     // socket.broadcast.emit('miscmsg',{flag : 0,id : socket.id})
  })
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});
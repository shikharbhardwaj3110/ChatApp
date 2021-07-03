var socket = io();

socket.on('connect', () => {
    console.log("Client connected to server !")
})

socket.on("message", (data) => {
    console.log(data)
    if (data.flag != 0) {
        console.log("Username unique !")
        window.location.assign("http://localhost:3000/chatroom?token=" + data.flag)
    }
    else
        console.log("Username invalid !")
})

buttonPress = () => {
    var username = document.getElementById('username').value
    console.log(username)
    socket.emit('saveClient', { username })
}
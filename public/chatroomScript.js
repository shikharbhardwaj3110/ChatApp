var socket = io();

var splitUrl = window.location.href.split("=")
var sid = splitUrl[1]

socket.on('connect', () => {
    socket.emit('verifyClient', sid)
})

socket.on('confirmClient', (data) => {
    if (!data)
        window.location.assign('http://localhost:3000/')
    else
        console.log("Client confirmed !!")
})

socket.on('miscmsg', (data) => {
    console.log(data)
    var statusCard = makeStatusCard(data.id, data.conf)
    var messages = document.getElementById("msgdiv")
    messages.appendChild(statusCard)
})

makeStatusCard = (id, flag) => {
    var statusDiv = document.createElement('div')
    var statusText = document.createElement('span')
    if (flag)
        statusText.textContent = id + " has joined the chat !"
    else
        statusText.textContent = id + " has left the chat !"
    statusDiv.appendChild(statusText)
    statusDiv.style.textAlign = "center"
    return statusDiv
}

var lastSender = "fresh"

timeNow = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return "Sent at " + strTime;
}

buildCard = (message, flag, clientName) => {

    var card = document.createElement('div')
    var cardContent = document.createElement('span')
    cardContent.textContent = message
    cardContent.style.fontSize = "15px"

    card.appendChild(cardContent)

    card.style.width = "fit-content"
    card.style.maxWidth = "60%"
    card.style.borderRadius = "10px"

    var outerCard = document.createElement('div')
    var outerCardText = document.createElement('span')
    var outerCardTextDiv = document.createElement('div')
    outerCardTextDiv.appendChild(outerCardText)

    var timeStamp = document.createElement('span')
    timeStamp.textContent = timeNow(new Date)
    timeStamp.style.fontSize = "12px"
    timeStamp.style.display = "block"
    timeStamp.style.marginTop = "10px"

    if (flag) {
        outerCardTextDiv.style.paddingRight = "10px"
        outerCardTextDiv.style.textAlign = "right"
        card.style.marginLeft = "auto"
        card.style.backgroundColor = "#ebebeb"
        card.style.border = "2px solid #ebebeb"
        cardContent.style.color = "black"
        timeStamp.style.color = "gray"
        if (lastSender != "You") {
            outerCardTextDiv.style.paddingBottom = "10px"
            outerCardText.textContent = "You"
            lastSender = "You"
        }
    }
    else {
        outerCardTextDiv.style.paddingLeft = "10px"
        outerCardTextDiv.style.textAlign = "left"
        cardContent.style.color = "white"
        card.style.backgroundColor = "royalblue"
        card.style.border = "1px solid royalblue"
        timeStamp.style.color = "white"
        if (lastSender != clientName) {
            outerCardText.textContent = clientName
            outerCardTextDiv.style.paddingBottom = "10px"
        }

    }

    card.style.paddingLeft = "8px"
    card.style.paddingRight = "8px"
    card.style.paddingBottom = "3px"
    card.style.paddingTop = "3px"

    //card.style.border = "1px solid black"
    card.style.wordWrap = "break-word"

    card.appendChild(document.createElement("br"))

    card.appendChild(timeStamp)
    outerCardText.style.fontWeight = "bold"
    outerCard.appendChild(outerCardTextDiv)
    outerCard.appendChild(card)
    outerCard.style.paddingBottom = "10px"

    return outerCard
}

sendmsg = () => {
    var inputValue = document.getElementById("inputtext").value
    var messages = document.getElementById("msgdiv")

    if (inputValue) {
        socket.emit('chat msg', { inputValue, sid })
        var item = buildCard(inputValue, 1, "You")
        lastSender = "You"
        document.getElementById("inputtext").value = ""
        messages.appendChild(item)
    }
}

socket.on('chat msg', (data) => {
    var messages = document.getElementById("msgdiv")
    var clientName = data.id
    var item = buildCard(data.data, 0, clientName)
    lastSender = clientName
    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight);
})

document.addEventListener('keypress', (e) => {
    var input = document.getElementById("inputtext")
    if (e.key == 'Enter' && input.value != null) {
        sendmsg()
    }
})


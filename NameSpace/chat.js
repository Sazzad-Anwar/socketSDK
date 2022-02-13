const chat = (socket) => {
    socket.on('connection', () => {
        console.log('connected to chat namespace')
    })
}

module.exports = chat;
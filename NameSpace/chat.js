let users = [];

const chat = (socket) => {

    console.log(`Socket ID: ${socket.id} is connected to chat namespace`);

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })

    socket.on('message', data => {
        socket.broadcast.emit('message', data);
    });

    socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
            socket.connect();
        } else {
            console.log(`Socket ID: ${socket.id} is disconnected from chat namespace`);
        }
    });

}

module.exports = chat;
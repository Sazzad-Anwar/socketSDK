const chat = (socket) => {

    console.log(`Socket ID: ${socket.id} is connected to chat namespace`);

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })

    socket.on('user-joined', async data => {
        socket.broadcast.emit('user-joined', ({ ...data, socketId: socket.id }));
    })

    socket.on('public-message', data => {
        socket.broadcast.emit('public-message', ({ ...data, from: socket.id }));
    })

    socket.on('private-message', data => {
        socket.to(data.to).emit('private-message', ({ ...data, from: socket.id, to: data.to }));
    });

    socket.on("disconnect", async () => {

        socket.emit('user-left', (socket.id));

        console.log(`Socket ID: ${socket.id} is disconnected from chat namespace`);
    });

}

module.exports = chat;
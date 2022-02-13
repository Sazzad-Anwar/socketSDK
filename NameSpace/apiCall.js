const fetch = require("../libs/fetch");

const apiCall = (socket) => {

    console.log(`Socket ID: ${socket.id} is connected to API namespace`);

    //Here the data object will take 'url','method','isApiCall','applicationId','requestName','body'
    socket.on('socket-data', async data => {

        if (data.isApiCall && data.url && data.method) {

            const { data: response } = await fetch(data);
            let responseData = {
                ...data,
                response
            }
            socket.broadcast.emit('socket-data', (responseData));
        } else {
            socket.broadcast.emit('socket-data', (data));
        }
    })

    socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
            socket.connect();
        }
        console.log(`Socket ID: ${socket.id} is disconnected from API namespace`);
    });
}

module.exports = apiCall;
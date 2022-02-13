const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const PORT = process.env.PORT || 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const fetch = async (data) => {
    switch (data.method) {
        case 'get':
            return await axios.get(data.url);
        case 'post':
            return await axios.post(data.url, data.body);
        case 'put':
            return await axios.put(data.url, data.body);
        case 'delete':
            return await axios.delete(data.url);
        default:
            return await axios.get(data.url);
    }
}


// check the status of the request
app.get('/', (req, res) => {
    res.json({
        message: 'Server is running',
        IP: req.ip
    })
})

io.on("connection", (socket) => {

    //Here the data object will take 'url','method','isApiCall','applicationId','requestName','body'
    socket.on('socket-data', async data => {
        const { data: response } = await fetch(data);
        let responseData = {
            ...data,
            response
        }
        socket.broadcast.emit('socket-data', (responseData));
    })

    socket.on('disconnected', socket => {
        console.log(`Socket id ${socket.id} got disconnected`)
    })
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const http = require('http');
const os = require('os');
const ip = require('ip');
const networkInterfaces = os.networkInterfaces();
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const PORT = process.env.PORT || 4000;
const app = express();
const cluster = require("cluster");
const chat = require("./NameSpace/chat");
const apiCall = require("./NameSpace/apiCall");


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    const httpServer = http.createServer();

    // setup sticky sessions
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection",
    });

    // setup connections between the workers
    setupPrimary();

    // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
    // Node.js < 16.0.0
    cluster.setupMaster({
        serialization: "advanced",
    });
    // Node.js > 16.0.0
    // cluster.setupPrimary({
    //   serialization: "advanced",
    // });

    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${process.pid} started`);

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    });

    // use the cluster adapter
    io.adapter(createAdapter());

    // setup connection with the primary process
    setupWorker(io);

    // check the status of the request
    app.get('/', (req, res) => {
        res.json({
            message: 'Server is running',
            processID: process.pid,
            hostname: os.hostname(),
            ip: ip.address()
        })
    })

    io.of('/chat').on('connection', (chat));
    io.of('/api').on('connection', (apiCall));
}
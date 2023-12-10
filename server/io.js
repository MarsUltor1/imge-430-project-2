const http = require('http');
const { Server } = require('socket.io');

let io;

// handle any tweet changes
const handleTweetChanges = (msg) => {
    io.emit('tweet change', msg);
}

// Setup socket functionality
const socketSetup = (app) => {
    const server = http.createServer(app);
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        // setup tweet change handler
        socket.on('tweet change', handleTweetChanges);
    });

    return server;
};

module.exports = socketSetup;
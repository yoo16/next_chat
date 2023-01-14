const express = require('express')
const dotenv = require('dotenv');

dotenv.config();
const host = process.env.SERVER_HOST
const port = process.env.SERVER_PORT
const CLIENT_HOST = process.env.CLIENT_HOST
const CLIENT_PORT = process.env.CLIENT_PORT
const CLIENT_URL = "http://" + CLIENT_HOST + ":" + CLIENT_PORT

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: [CLIENT_URL]
    }
})
const uuidv4 = require('uuid').v4

var users = {}
var userIndex = 0

const logout = (socket) => {
    var user = fetchUser(socket);
    if (!user) return;

    delete users[socket.id];
    socket.broadcast.emit('user_left', {
        user: user,
        users: users,
    })
}

const fetchUser = (socket) => {
    if (!users) return;
    return users[socket.id];
}

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        console.log('message')
        if (data.message) {
            data.user = fetchUser(socket)
            data.datetime = Date.now();
            io.emit('message', data);
        }
    })

    socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log("joined room!");
    });

    socket.on('auth', (user) => {
        if (users[socket.id]) return;
        const number = (userIndex + 6) % 6 + 1
        userIndex++

        user.id = socket.id
        user.token = uuidv4();
        user.icon = 'images/users/' + number + ".png"
        users[socket.id] = user

        socket.emit('auth', { user: user, users: users });
        socket.broadcast.emit('user_joined', { user: user, users: users });
    });

    socket.on('upload_stamp', (data) => {
        data.datetime = Date.now();
        io.emit('upload_stamp', data);
    });

    socket.on('upload_image', (data) => {
        data.datetime = Date.now();
        io.emit('load_image', data);
    });

    socket.on('logout', () => {
        logout(socket)
    });

    socket.on('disconnect', () => {
        logout(socket)
    });
})

http.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`)
})
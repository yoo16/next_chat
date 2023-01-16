const dotenv = require('dotenv');
dotenv.config();
const SERVER_HOST = process.env.SERVER_HOST
const SERVER_PORT = process.env.SERVER_PORT
const CLIENT_HOST = process.env.CLIENT_HOST
const CLIENT_PORT = process.env.CLIENT_PORT

const express = require('express')
const uuidv4 = require('uuid').v4
const app = express()
const http = require('http').createServer(app)

const CLIENT_URL = "http://" + CLIENT_HOST + ":" + CLIENT_PORT
const io = new require('socket.io')(http, {
    cors: {
        origin: [CLIENT_URL]
    }
})

var users = { }

const login = (socket ,user) => {
    if (users[socket.id]) return;

    user.id = socket.id
    user.token = uuidv4();
    users[socket.id] = user

    var message = user.name + "さんが、入室しました"
    var data = {
        user: user,
        users: users,
        message: message,
        datetime: Date.now(),
    }
    socket.emit('auth', data);
    socket.broadcast.emit('user_joined', data);
}

const logout = (socket) => {
    const user = fetchUser(socket);
    if (!user) return;

    delete users[socket.id];
    var message = user.name + "さんが、退出しました"
    var data = {
        message: message,
        users: users,
    }
    socket.broadcast.emit('user_left', data)
}

const fetchUser = (socket) => {
    if (!users) return;
    return users[socket.id];
}

// SocketIO
io.on('connection', (socket) => {
    socket.on('message', (data) => {
        if (data.message) {
            data.user = fetchUser(socket)
            data.datetime = Date.now();
            io.emit('message', data);
        }
    })

    socket.on("join", (roomId) => {
        socket.join(roomId);
    });

    socket.on('auth', (user) => {
        login(socket, user)
    });

    socket.on('upload_stamp', (data) => {
        data.datetime = Date.now();
        io.emit('upload_stamp', data);
    });

    socket.on('logout', () => {
        logout(socket)
    });

    socket.on('disconnect', () => {
        logout(socket)
    });
})

http.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`listening on http://${SERVER_HOST}:${SERVER_PORT}`)
})
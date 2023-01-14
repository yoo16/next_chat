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

var users = {};

logout = (socket) => {
    console.log('logout');

    var user = fetchUser(socket);
    if (!user) return;

    //ユーザ削除
    delete users[socket.id];

    //送信元以外全てのクライアントに送信
    socket.broadcast.emit('user_left', {
        username: user.name,
        users: users,
    });
}

fetchUser = (socket) => {
    if (!users) return;
    return users[socket.id];
}

//connection イベント 
io.on('connection', (socket) => {
    // client から server のメッセージ
    socket.on('message', (data) => {
        if (data.message) {
            console.log(data)
            data.user_name = users[socket.id]
            data.datetime = Date.now();
        }
        io.emit('message', data);
    })

    socket.on('auth', (user) => {
        if (user.token) return;
        user.id = socket.id
        user.token = uuidv4();
        users[socket.id] = user;
        socket.emit('auth', {user: user});
        socket.broadcast.emit('user_joined', {users: users});
    });

    socket.on('upload_stamp', (data) => {
        console.log('upload_stamp');
        data.datetime = Date.now();
        io.emit('load_stamp', data);
    });

    socket.on('upload_image', (data) => {
        data.datetime = Date.now();
        io.emit('load_image', data);
    });

    socket.on('logout', () => {
        logout(socket);
    });

})

http.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`)
})
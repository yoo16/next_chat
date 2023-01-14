import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import io from "socket.io-client"

import { IconButton } from "@material-ui/core"
import ImageIcon from '@material-ui/icons/Image'
import LogoutIcon from '@material-ui/icons/ExitToApp'

import styles from '../styles/Home.module.css'
import chatStyles from '../styles/Chat.module.css'

const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST
const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT
const SERVER_URL = "http://" + SERVER_HOST + ":" + SERVER_PORT
const stamps = [
    'stamp1.png', 'stamp2.png', 'stamp3.png', 'stamp4.png', 'stamp5.png', 'stamp6.png',
]
const icons = [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
]

function chat() {
    const [socket, _] = useState(() => io(SERVER_URL))
    const [newChat, setNewChat] = useState('')
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({ id: '', name: '' })
    const [users, setUsers] = useState([])
    // const [users, setUsers] = useState({})
    const [visible, setVisible] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (router.asPath !== router.route) {
            auth(router.query.name)
        }
    }, [router]);

    const auth = (name) => {
        if (user.id) return
        if (name) {
            socket.emit('auth', { id: socket.id, name: name })
        }
    }

    const sendChat = () => {
        if (newChat) {
            socket.emit('message', {
                user: user,
                message: newChat
            })
            setNewChat({ message: '' })
        }
    }

    const sendStamp = (src) => {
        const image = new Image()
        image.src = src
        image.onload = (e) => {
            const canvas = document.createElement('canvas')
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            var base64 = canvas.toDataURL('image/png')
            var data = { user: user, image: base64 }
            socket.emit('upload_stamp', data)
        }
    }

    const logout = () => {
        if (user.id) {
            socket.emit('logout')
            router.push('/')
        }
    }

    // Socket.io
    socket.on('auth', (data) => {
        if (data) {
            setUser(data.user)
            setUsers(data.users)
        }
    })

    socket.on('user_joined', (data) => {
        if (data) {
            setUsers(data.users)
        }
    })

    socket.on('message', (data) => {
        if (data.message) {
            setChats([...chats, data])
        }
    })

    socket.on('upload_stamp', (data) => {
        if (data.image) {
            setChats([...chats, data])
        }
    })

    socket.on('user_left', (data) => {
    })

    socket.on('disconnect', () => {
        console.log('disconnect!!!')
        logout()
    })

    return (
        <div className={styles.container}>
            <h1 className="flex justify-center m-3 text-3xl">Chat</h1>
            <div className="flex justify-end">
                <div className={chatStyles.userIcon}>
                    <img
                        className="h-10 w-10 object-cover rounded-full"
                        src={user.icon} />
                </div>
                {user.name}さん
                <IconButton onClick={logout}>
                    <LogoutIcon />
                </IconButton>
            </div>

            <div className="chatList">
                <input
                    onChange={(e) => { setNewChat(e.target.value) }}
                    className="w-50 block bg-white w-full border rounded-md my-3 py-3 pl-2 pr-1"
                    type="text"
                    placeholder="メッセージ"
                    value={newChat.message}
                />

                <div className="flex">
                    <IconButton onClick={() => setVisible(!visible)}>
                        <ImageIcon />
                    </IconButton>

                    <button
                        className="w-40 bg-blue-500 mr-3 p-1 text-white rounded hover:bg-blue-700 hover:shadow-xl"
                        onClick={sendChat}
                        disabled={newChat == ''}>
                        Send
                    </button>
                </div>

                <div className="flex">
                    {(visible) && stamps.map((image, key) => {
                        return (
                            <div>
                                <img
                                    onClick={(e) => { sendStamp(e.target.src) }}
                                    src={`/images/stamp/${image}`} width="120"
                                />
                            </div>
                        )
                    })}
                </div>
            </div>


            <div className="grid grid-cols-4">
                <div className="col-span-3 mr-2">
                    {chats.map((data, key) => {
                        return (
                            <div className={chatStyles.chat} key={key}>
                                <div className={chatStyles.chatUser}>
                                    <div className={chatStyles.userIcon}>
                                        <img
                                            className="h-10 w-10 object-cover rounded-full"
                                            src={data.user.icon} />
                                    </div>
                                    <div className={chatStyles.userName}>
                                        {data.user.name}
                                    </div>
                                </div>
                                <di className={chatStyles.chatMessage}>
                                    {
                                        (data.image) ?
                                            <img src={data.image} width="150" />
                                            :
                                            data.message
                                    }
                                </di>
                            </div>
                        )
                    })}
                </div>

                <div className="col-span-1 mt-2">
                    <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.keys(users).map((key) => {
                            return (
                                <li class="p-3">
                                    <div class="flex">
                                        <div class="w-20">
                                            <img
                                                src={users[key].icon}
                                                className="h-10 w-10 object-cover rounded-full"
                                            />
                                        </div>
                                        <div class="text-base text-gray-500">
                                            {users[key].name}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

        </div >
    )
}

export default chat
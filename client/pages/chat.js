import React, { useEffect, useState, useRef } from 'react';
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

const socket = io(SERVER_URL)

function chat() {
    const [newChat, setNewChat] = useState('')
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [users, setUsers] = useState([])
    const [visible, setVisible] = useState(false)
    const router = useRouter()

    const webSocketRef = useRef()

    const auth = (name) => {
        if (user.id) return
        if (name) {
            socket.emit('auth', { id: socket.id, name: name })
        }
    }

    const sendChat = () => {
        console.log('sendChat')
        if (newChat) {
            const data = {
                user: user,
                message: newChat
            }
            socket.emit('message', data)
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
            canvas = null
            ctx = null
        }
    }
    const logout = () => {
        if (user.id) {
            socket.emit('logout')
            router.push('/')
        }
    }

    useEffect(() => {
        if (router.asPath !== router.route) {
            auth(router.query.name)
        }
    }, [router]);

    // Socket.io
    useEffect(() => {
        socket.on('auth', (data) => {
            console.log('auth')
            if (data) {
                setUser(data.user)
                setUsers(data.users)
            }
        })
        socket.on('user_joined', (data) => {
            console.log('user_joined')
            if (data) {
                setUsers(data.users)
            }
        })
        socket.on('user_left', (data) => {

        })
        socket.on('disconnect', () => {
            logout()
        })
    }, [])

    const saveChat = (data) => {
        setChats((prev) => [...prev, data])
        setVisible(false)
    }

    useEffect(() => {
        socket.on('message', (data) => {
            console.log('client message')
            saveChat(data)
        })
        socket.on('upload_stamp', (data) => {
            saveChat(data)
        })
    }, [])

    return (
        <div className={styles.container}>
            <h1 className="flex justify-center m-3 text-3xl">Chat</h1>

            <div className="sticky top-0 z-50 bg-white">
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

                <div>
                    <div className="flex">
                        <input
                            onChange={(e) => { setNewChat(e.target.value) }}
                            className="w-50 block bg-white w-full border py-3 pl-2 pr-1"
                            type="text"
                            placeholder="メッセージ"
                            value={newChat.message}
                        />
                        <button
                            className="w-40 bg-blue-500 p-1 text-white hover:bg-blue-700 hover:shadow-xl"
                            onClick={sendChat}
                            disabled={newChat == ''}>
                            Send
                        </button>
                    </div>

                    <div className="flex">
                        <IconButton onClick={() => setVisible(!visible)}>
                            <ImageIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="flex">
                    {(visible) && stamps.map((image, index) => {
                        return (
                            <div key={index}>
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
                <div className="col-span-3 mr-2 flex flex-col-reverse">
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
                                <div className={chatStyles.chatMessage}>
                                    {
                                        (data.image) ?
                                            <img src={data.image} width="150" />
                                            :
                                            data.message
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="col-span-1 mt-2">
                    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                        {Object.keys(users).map((key, index) => {
                            return (
                                <li className="p-3" key={index}>
                                    <div className="flex">
                                        <div className="w-20">
                                            <img
                                                src={users[key].icon}
                                                className="h-10 w-10 object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="text-base text-gray-500">
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
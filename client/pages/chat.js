import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import io from "socket.io-client"

// Components
import { ChatUser } from '../components/chat/ChatUser';
import { ChatList } from '../components/chat/ChatList';
import { UserList } from '../components/chat/UserList';
import { StampList } from '../components/chat/StampList';
import { ChatForm } from '../components/chat/ChatForm';

// UI
import { IconButton } from "@material-ui/core"
import ImageIcon from '@material-ui/icons/Image'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import styles from '../styles/Home.module.css'

const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST
const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT
const SERVER_URL = "http://" + SERVER_HOST + ":" + SERVER_PORT
const socket = io(SERVER_URL)

function chat() {
    const [newChat, setNewChat] = useState('')
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [users, setUsers] = useState([])
    const [visible, setVisible] = useState(false)
    const router = useRouter()

    const auth = (name) => {
        if (user.id) return
        if (name) socket.emit('auth', { id: socket.id, name: name })
    }

    const sendChat = () => {
        if (!newChat) return
        const data = { user: user, message: newChat }
        socket.emit('message', data)
        setNewChat({ message: '' })
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
        if (user.id) socket.emit('logout')
        router.push('/')
    }

    const saveChat = (data) => {
        setChats((prev) => [...prev, data])
        setVisible(false)
    }

    // Router
    useEffect(() => {
        if (router.asPath !== router.route) {
            auth(router.query.name)
        }
    }, [router]);

    // Socket.io
    useEffect(() => {
        console.log('io')
        socket.on('auth', (data) => {
            if (!data) return
            setUser(data.user)
            setUsers(data.users)
        })
        socket.on('disconnect', () => {
            logout()
        })
        socket.on('message', (data) => {
            if (!data) return
            saveChat(data)
        })
        socket.on('upload_stamp', (data) => {
            if (!data) return
            saveChat(data)
        })
        socket.on('user_joined', (data) => {
            if (!data) return
            setUsers(data.users)
            saveChat(data)
        })
        socket.on('user_left', (data) => {
            if (!data) return
            saveChat(data)
        })
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div className="sticky top-0 z-50 bg-white">

                    <div className="flex justify-end m-3">
                        <ChatUser user={user} />
                        <IconButton onClick={logout}>
                            <LogoutIcon />
                        </IconButton>
                    </div>

                    <div className="flex">
                        <ChatForm
                            newChat={newChat}
                            setNewChat={setNewChat}
                            sendChat={sendChat} />
                    </div>

                    <div className="flex justify-end m-3">
                        <IconButton onClick={() => setVisible(!visible)}>
                            <ImageIcon />
                        </IconButton>
                        {visible && <StampList sendStamp={sendStamp} />}
                    </div>

                </div>

                <div className="grid grid-cols-4">
                    <ChatList chats={chats} user={user}></ChatList>
                    <UserList users={users}></UserList>
                </div>

            </div>
        </>
    )
}

export default chat
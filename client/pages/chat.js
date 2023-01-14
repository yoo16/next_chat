import io from "socket.io-client"
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import chatStyles from '../styles/Chat.module.css'
import { useEffect, useState } from 'react';

const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST
const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT
const SERVER_URL = "http://" + SERVER_HOST + ":" + SERVER_PORT

function chat() {
    const [socket, _] = useState(() => io(SERVER_URL))
    const [newChat, setNewChat] = useState('')
    const [chats, setChats] = useState([])
    const [user, setUser] = useState({id: '', name: ''})
    const [users, setUsers] = useState([])
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        if (router.asPath !== router.route) {
            setUser({name: router.query.name})
            auth(router.query.name)
        }
      }, [router]);

    const auth = (name) => {
        if (name) {
            socket.emit('auth', { name: name })
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

    socket.on('user_joined', (data) => {
        console.log(data)
        if (data) {
            setUsers([...users, data])
        }
    })

    socket.on('message', (data) => {
        if (data.message) {
            setChats([...chats, data])
        }
    })

    return (
        <div className={styles.container}>
            <h2>Chat</h2>
            <h3>{user.name}さん</h3>
            <div className={styles.chatForm}>
                <input
                    onChange={(e) => { setNewChat(e.target.value) }}
                    type="text"
                    placeholder="メッセージ"
                    value={newChat.message}
                />
                <button onClick={sendChat} disabled={newChat == ''}>送信</button>
            </div>

            {chats.map((data, key) => {
                return (
                    <div key={key}>
                        <div>
                            {data.user.name}
                        </div>
                        <div>
                            {data.message}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default chat
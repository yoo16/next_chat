import React from 'react'
import styles from '../../styles/Chat.module.css'
import { ChatUser } from './ChatUser'

export const ChatList = ({ chats, user }) => {
    const dateFormat = (datetime) => {
        if (!datetime) return
        return new Date(datetime).toLocaleString('ja-JP')
    }
    return (
        <div className="col-span-3 mr-2 flex flex-col-reverse">
            {chats.map((data, key) => {
                return (
                    <div className={styles.chat} key={key}>
                        {data.user && <ChatUser user={data.user} />}
                        <div className={`${styles.chatMessage} ${data.user.id == user.id ? styles.self : ""}`}>
                            <div>
                                {data.image && <img src={data.image} />}
                                {data.message}
                            </div>

                            <div className="flex justify-end">
                                {dateFormat(data.datetime)}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

import React from 'react'
import styles from '../../styles/Chat.module.css'
import { Avatar } from "@material-ui/core"

export const ChatUser = ({ user }) => {
    return (
        <div className={styles.chatUser}>
            <Avatar />
            <div className={styles.userName}>{user.name}</div>
        </div>
    )
}
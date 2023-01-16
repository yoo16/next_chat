import React from 'react'
import { ChatUser } from './ChatUser'

export const UserList = ({ users }) => {
    return (
        <div className="col-span-1 mt-2">
            <div className="grid grid-cols-3">
                {Object.keys(users).map((key, index) => {
                    return (
                        <div className="p-2" key={index}>
                            <ChatUser user={users[key]} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

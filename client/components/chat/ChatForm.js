import React from 'react'

export function ChatForm(props) {
    return (
        <>
            <input
                onChange={(e) => { props.setNewChat(e.target.value) }}
                className="w-50 bg-white w-full border py-3 pl-2 pr-1"
                type="text"
                placeholder="メッセージ"
                value={props.newChat.message}
            />
            <button
                className="w-40 bg-blue-500 p-1 text-white hover:bg-blue-700 rounded-md"
                onClick={props.sendChat}
                disabled={props.newChat == ''}>
                Send
            </button>
        </>
    )
}

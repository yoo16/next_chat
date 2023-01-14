import axios from 'axios'
import { useState } from 'react'

export default function Login() {
    const baseURL = process.env.NEXT_PUBLIC_LARAVEL_URL
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const changeEmail = (e) => {
        setEmail(e.target.value)
    }
    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleClick = () => {
        const loginParams = { email, password }
        axios
            .get(baseURL + 'sanctum/csrf-cookie', { withCredentials: true })
            .then((response) => {
                axios
                    .post(
                        baseURL + 'login',
                        loginParams,
                        { withCredentials: true }
                    )
                    .then((response) => {
                        console.log(response.data)
                    })
            })
    }

    // SPA認証済みではないとアクセスできないAPI
    const handleUserClick = () => {
        axios.get(baseURL + 'api/user', { withCredentials: true }).then((response) => {
            console.log(response.data)
        })
    }

    return (
        <>
            <div>
                <label htmlFor="">メールアドレス</label>
                <input onChange={changeEmail} />
            </div>
            <div>
                <label htmlFor="">パスワード</label>
                <input onChange={changePassword} />
            </div>
            <div>
                <button onClick={handleClick}>ログイン</button>
            </div>
            <div>
                <button onClick={handleUserClick}>ユーザー情報を取得</button>
            </div>
        </>
    )
}
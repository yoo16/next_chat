import { useRouter } from "next/router";

// Components
import SideMenu from '../components/SideMenu';

// UI
import styled from "styled-components"
import { Button } from "@material-ui/core"

export default function Home() {
    const router = useRouter()

    const startChat = () => {
        const name = prompt('名前を入力してください。')
        if (!name) return;
        router.push({
            pathname: "/chat",
            query: { name: name }
        })
    }

    return (
        <div>
            <SideMenu></SideMenu>
            <ChatButton onClick={startChat}>Login</ChatButton>
        </div>
    )

}

const ChatButton = styled(Button)`
    width: 100%;
`
import { useRouter } from "next/router";
import { useState } from 'react';
import { Avatar, Button, IconButton } from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'

function SideMenu() {
    const router = useRouter()
    const [user, setUser] = useState({
        id: 0, name: ""
    })

    const startChat = () => {
        const name = prompt('名前を入力してください。')
        if (!name) return;
        router.push({
            pathname: "/chat",
            query: { name: name }
        })
    }

    return (
        <Container>
            <Header>
                <UserAvatar />
                <Icons>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </Icons>
            </Header>

            <ChatButton onClick={startChat}>Login</ChatButton>

        </Container>
    )
}

export default SideMenu

const Container = styled.div``;
const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    justify-content: space-between;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
     cursor: pointer;
     :hover {
         opacity: 0.8;
     }
`

const Icons = styled.div``

const ChatButton = styled(Button)`
    width: 100%;
`

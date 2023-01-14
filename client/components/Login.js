import { Avatar, Button, IconButton } from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useRouter } from "next/router";
import axios from 'axios'
import { useState } from 'react';

function Login() {
    const router = useRouter()
    const [user, setUser] = useState({
        id: 0, name: ""
    })

    const input = async () => {
        const name = prompt('名前を入力してください。')
        if (!name) return;
        await join(name)
    }

    const join = async (name) => {
        const result = await axios.get('/api/user/findEmail/' + email);
        const user = result.data
        if (!user.id) user = createUser(name)
        setUser(user)
    }

    const createUser = async (name) => {
        const user = {
            name: name,
        }
        // result = await axios.post('/api/user/create', post)
        // let user = result.data
        router.push("/chat")
        return user
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

            <div>{user.email}</div>
            <ChatButton onClick={startChat}>Start</ChatButton>
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
`;

const Icons = styled.div``;

const ChatButton = styled(Button)`
    width: 100%;
`;

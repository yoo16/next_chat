import { Avatar, Button, IconButton } from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import axios from 'axios'
import { useState } from 'react';

function SideMenu() {
    //TODO model
    let defaultUser = { id: 0, name: "", email: "" }
    const [user, setUser] = useState(defaultUser)

    const startChat = async () => {
        const email = prompt('Email を入力してください。')
        if (!email) return;

        await join(email)
    }

    const join = async (email) => {
        let result = await axios.get('/api/user/findEmail/' + email);
        let user = result.data
        if (!user.id) user = createUser(email)
        setUser(user)
    }

    const createUser = async (email) => {
        const post = {
            name: '',
            email: email,
        }
        result = await axios.post('/api/user/create', post)
        let user = result.data
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

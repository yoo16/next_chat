import React from "react";
import { IconButton } from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'

function SideMenu() {

    return (
        <Container>
            <Header>
                <Icons>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </Icons>
            </Header>
        </Container>
    )
}

export default SideMenu

const Container = styled.div`
    display: flex;
    justify-content: end;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: white;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    z-index: 1;
`;
const Icons = styled.div``
import { Avatar } from "@material-ui/core"
import styled from "styled-components"

function SideMenu() {
    return (
        <Container>
            <UserAvatar />
        </Container>
    )
}

export default SideMenu

const Container = styled.div ``;

const UserAvatar = styled(Avatar) `
    margin: 10px;
`;
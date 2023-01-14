import styled from "styled-components"
import CircularProgress from '@material-ui/core/CircularProgress'

function Loading() {
    return (
        <Container>
            <CircularProgress></CircularProgress>
        </Container>
    )
}

export default Loading

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;
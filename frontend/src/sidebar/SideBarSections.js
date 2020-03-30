/* Upper and lower styling of side bar
*/
import styled from 'styled-components'

export const Upper = styled.div`
    height: 100px;
    width: 50px;
    margin: 10px;
    background: #F5F5F5;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items:center;
    position: absolute;
    top: 0px;
    left: -10px;
    z-index: 1;
    border-radius: 10px;
`

export const Lower = styled.div`
    height: 120px;
    width: 50px;
    margin: 10px;
    background: #F5F5F5;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items:center;
    position: absolute;
    top: 230px;
    left: 40px;
    z-index: 1;
    border-radius: 10px;
`

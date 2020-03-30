/* Contains all the styling for all four sidebar nodes
*       - Tree
*       - Queue
*       - Edit
*       - Delete
*/
import styled from 'styled-components'

import TreeNodeImage from '../Sprites/TreeNodeImage.png'
import QueueNodeImage from '../Sprites/QueueNodeImage.png'
import XImage from '../Sprites/XImage.png'
import EditImage from '../Sprites/EditImage.png'


export const TreeButton = styled.div`
    font-size: 14px;
    background: #FA7C92;
    cursor: move;
    margin: 10px 0px;
    clip-path: circle();
    height: 30px;
    width: 30px;
    display: flex;
    align-items:center;
    text-align: center;
    position: relative;
    top: -10px;
    background-image: url(${TreeNodeImage});
    background-repeat: no-repeat;
    background-size: 50% 60%;
    background-position: center;
    transition: 0.3s ease all;
    cursor: pointer;
    &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,.1);
    }
`

export const QueueButton = styled.div`
    font-size: 14px;
    background: #6EC4DB;
    cursor: move;
    float: left;
    margin: 10px 0px;
    clip-path: circle();
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
    top: -20px;
    background-image: url(${QueueNodeImage});
    background-repeat: no-repeat;
    background-size: 25% 50%;
    background-position: center;
    transition: 0.3s ease all;
    cursor: pointer;
    &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,.1);
    }
`

export const EditButton = styled.div`
font-size: 14px;
background: #0375B4;
cursor: move;
margin: 10px 20px;
clip-path: circle();
height: 30px;
width: 30px;
display: flex;
align-items:center;
text-align: center;
position: relative;
top: 20px;
background-image: url(${EditImage});
background-repeat: no-repeat;
background-size: 45% 45%;
background-position: center;
transition: 0.3s ease all;
cursor: pointer;
&:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,.1);
}
`

export const DeleteButton = styled.div`
font-size: 14px;
background: #FF002D;
cursor: move;
margin: 10px 20px;
clip-path: circle();
height: 30px;
width: 30px;
display: flex;
align-items:center;
text-align: center;
background-image: url(${XImage});
background-repeat: no-repeat;
background-position: center;
background-size: 35% 35%;
transition: 0.3s ease all;
cursor: pointer;
&:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,.1);
}
`
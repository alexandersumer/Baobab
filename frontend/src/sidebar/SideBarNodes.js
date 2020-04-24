/* Contains all the styling for all four sidebar nodes
 *       - Tree
 *       - Queue
 *       - Edit
 *       - Delete
 */
import styled from "styled-components";

import TreeNodeImage from "../img/TreeNodeImage.png";
import QueueNodeImage from "../img/QueueNodeImage.png";
import XImage from "../img/XImage.png";
import EditImage from "../img/EditImage.png";
import BeautifyImage from "../img/tree.svg";
import toolsImage from "../img/support.png"

export const TreeButton = styled.div`
  font-size: 14px;
  background: #fa7c92;
  cursor: move;
  margin: 10px 0px;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  top: -10px;
  background-image: url(${TreeNodeImage});
  background-repeat: no-repeat;
  background-size: 50% 60%;
  background-position: center;
  transition: 0.3s ease all;
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
  &:active {
    opacity: 0.3;
  }
`;

export const BeautifyTreeButton = styled.div`
  font-size: 14px;
  background: #e6f7ff;
  cursor: move;
  margin: 10px 0px;
  clip-path: circle();
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  top: -10px;
  background-image: url(${BeautifyImage});
  background-repeat: no-repeat;
  background-size: 50% 60%;
  background-position: center;
  transition: 0.3s ease all;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

export const QueueButton = styled.div`
  font-size: 14px;
  background: #6ec4db;
  cursor: move;
  float: left;
  margin: 10px 0px;
  border-radius: 50%;
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
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  &:active {
    opacity: 0.3;
    clip-path: circle();
  }
`;

// Currenlty to be repurposed TODO
export const EditButton = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  background: #0375B4;
  cursor: move;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  top:10px;
  background-image: url(${toolsImage});
  background-repeat: no-repeat;
  background-size: 55% 55%;
  background-position: center;
  transition: 0.3s ease all;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

export const DeleteButton = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  background: #ff002d;
  cursor: move;
  clip-path: circle();
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  background-image: url(${XImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 35% 35%;
  transition: 0.3s ease all;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

export const DeleteButtonNah = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  background: #ff002d;
  cursor: move;
  clip-path: circle();
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  text-align: center;
  background-image: url(${XImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 35% 35%;
  transition: 0.3s ease all;
  opacity: 0.2;
  &:hover {
    cursor: not-allowed;
  }
`;
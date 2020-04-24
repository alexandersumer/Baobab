/* CSS Styling for the three types of nodes:
 *
 *   - DaddyTreeNode (root node, output-only)
 *   - TreeNode (clickable, input-output)
 *   - QueueHead (give me head)
 */
import styled from "styled-components";
import { gridSize } from "@atlaskit/theme";

export const DaddyTreeNode = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  line-height: 10px;
  background: ${props => props.config.nodeColour};
  color: #f5f5f5;
  border-radius: 10px;
  transition: box-shadow 100ms ease-in-out;
  &:hover {
    box-shadow: 0 0px 30px 2px rgba(0,0,0,0.3);
  }
`;

export const TreeNode = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  line-height: 10px;
  background: ${props => props.config.nodeColour};
  color: #f5f5f5;
  border-radius: 10px;
  transition: box-shadow 100ms ease-in-out;
  &:hover {
    box-shadow: 0 0px 30px 2px rgba(0,0,0,0.3);
  }
`;
export const QueueHead = styled.div`
  position: absolute;
  width: 175px;
  height: 10px;
  padding: 30px;
  text-align: center;
  background: ${props => props.config.queueColour};
  color: #f5f5f5;
  border-radius: 10px;
  transition: box-shadow 100ms ease-in-out;
  &:hover {
    box-shadow: 0 0px 30px 2px rgba(0,0,0,0.3);
  }
`;

export const QDiv = styled.div`
  right: 39.5px;
  position: relative;
  margin-top: 5px;
`;

export const QTitle = styled.h4`
  position: relative;
  margin: 0;
  top: -35px;
  right: -10px;
  color: white;
  width: 175px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  vertical-align: middle;
  line-height: 1;
`;

export const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

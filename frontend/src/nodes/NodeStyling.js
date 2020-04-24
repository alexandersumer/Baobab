/* Customizes the style of the node dependant
 *    of type of node (input/output)
 */
import * as React from "react";
import { DaddyTreeNode, TreeNode, QueueHead } from "./nodeTypes";

export const NodeStyles = React.forwardRef(
  ({ node, children, ...otherProps }, ref) => {
    if (node.properties.custom === "output-only") {
      return (
        <DaddyTreeNode ref={ref} {...otherProps}>
          {children}
        </DaddyTreeNode>
      );
    } else if (node.properties.custom === "input-output") {
      return (
        <TreeNode ref={ref} {...otherProps}>
          {children}
        </TreeNode>
      );
    } else if (node.properties.custom === "input-only") {
      return (
        <QueueHead ref={ref} {...otherProps}>
          {children}
        </QueueHead>
      );
    } else {
      return (
        // Does nothing
        <QueueHead ref={ref} {...otherProps}>
          {children}
        </QueueHead>
      );
    }
  }
);

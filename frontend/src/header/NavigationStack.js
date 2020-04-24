import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as NavNext } from "../img/navNext.svg";
import { color } from "../kanban/Constants";
import firebase from "../firebase";
import { message } from "antd";
import QueueAnim from "rc-queue-anim";

export const NavigationStack = props => {
  const [navigationStack, setNavStack] = useState([]);

  useEffect(() => {
    const pageID = props.pageID;
    firebase
      .getFunctionsInstance()
      .httpsCallable("GetPathToNode")({
        leafNode: pageID
      })
      .then(result => {
        setNavStack(result.data.path.reverse());
      })
      .catch(e => {
        console.error(e);
        message.error("Failed to load path to this node", 0.5);
      });
  }, [props.pageID]);

  // Generate nav stack here
  return (
    <div style={{ display: "inline-flex", marginLeft: "69px" }}>
      <QueueAnim>
        {navigationStack.map((item, index) => {
          return (
            <div key={item.id + index} style={{ display: "inline-flex" }}>
              <NavigationItem
                onNavigate={path => {
                  props.onNavigate(path);
                }}
                title={item.title ? item.title : "Dashboard"}
                type={item.type ? item.type : "Landing"}
                id={item.id ? item.id : item.treeID}
              />
              {index !== navigationStack.length - 1 && (
                <NavNext style={{ width: "10pt" }} />
              )}
            </div>
          );
        })}
      </QueueAnim>
    </div>
  );
};

const NavigationItemWrapper = styled.div`
  margin: 5px;
  padding: 2.5px;
  text-align: center;
  border-radius: 10px;
  padding-left: 20px;
  padding-right: 20px;
  opacity: 0.75;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const NavigationItem = props => {
  const { title, type, id, onNavigate } = props;

  var path = "/tree/" + id;
  var style;

  if (type === "Kanban") {
    path = "/kanban/" + id;
    style = { background: color.QUEUE_KANBAN };
  } else if (type === "Landing") {
    path = "/dashboard";
    style = { background: color.KANBAN_LANE_OVER };
  } else if (type === "Queue") {
    style = { background: color.QUEUE_HEAD };
  } else if (type === "NestedTree") {
    style = { background: color.QUEUE_NESTED };
  } else {
    style = { background: color.TREE_NODE };
  }

  return (
    <NavigationItemWrapper
      className="noselect"
      onClick={() => {
        onNavigate(path);
      }}
      style={style}cd 
    >
      {title}
    </NavigationItemWrapper>
  );
};

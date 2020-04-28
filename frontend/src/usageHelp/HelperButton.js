import * as React from "react";
import { Modal as Modalant, Button } from "antd";
import Flickity from "react-flickity-component";
import "flickity/dist/flickity.min.css";
import "./styles/chatbot-prompt.css";
import "./styles/helper-button.css";
import "./styles/flicky.css";
import i from "../img/i.png";

class HelperButton extends React.Component {
  render() {
    return (
      <div>
        <button className="helper-button" onClick={this.props.onClick}>
          <div class="tooltip420">
            <img className={"resize"} src={i} />
            <span class="tooltiptext420"> Need some help? </span>
          </div>
        </button>

        <Modalant
          title="Let's get you up to date!"
          style={{ top: 20 }}
          visible={this.props.isOpen}
          onOk={this.props.onClick}
          onCancel={this.props.onClick}
          footer={[
            <div className={"chatbot-message"}>
              You can also ask Baobot for help!
            </div>,
            <Button type="primary" onClick={this.props.onClick}>
              Ok
            </Button>,
          ]}
        >
          <Flickity
            className={"carousel"}
            elementType={"div"}
            options={this.props.flickityOptions}
            disableImagesLoaded={false}
          >
            <div className="sideBarSlider">
              <div className="sideBarImg"></div>
              <div className="sideBarText">
                This is the side bar. You can drag and drop nodes, sexify your
                tree, edit your aesthetics and delete selected nodes.
              </div>
            </div>
            <div className="treeNodeSlider">
              <div className="treeSliderImg"></div>
              <div className="treeSliderText">
                This is the tree node. It can be used to represent forks of your
                tree. Drag and drop this component onto your canvas to start
                creating your tree.
              </div>
            </div>
            <div className="nodeTreeSlider">
              <div className="nodeTreeImg"></div>
              <div className="nodeTreeText">
                After you have dragged a tree node onto your canvas, you will
                see this! You can rename it by clicking on the text and connect
                it to other components in your tree.
              </div>
            </div>
            <div className="queueSlider">
              <div className="queueSliderImg"></div>
              <div className="queueSliderText">
                This is the queue node. It is the next level of organisation for
                smaller tasks or objectives. This node stems from tree nodes and
                can be used to create kanban boards or nested trees.
              </div>
            </div>
            <div className="queueCanvasSlider">
              <div className="queueCanvasImg"></div>
              <div className="queueCanvasText">
                After you have dragged a queue node to your canvas, you will see
                this! You can rename it in the same way as a tree node. You can
                also add nested trees and kanban boards and re-order the
                contents in this section by dragging them.
              </div>
            </div>
            <div className="kanbanSlider">
              <div className="kanbanImg"></div>
              <div className="kanbanText">
                Clicking this button will create a kanban board. Clicking on the
                created board will take you to a kanban page where you can add
                tasks to do.
              </div>
            </div>
            <div className="nestedSlider">
              <div className="nestedImg"></div>
              <div className="nestedText">
                Clicking on this button will create a nested tree. Clicking on
                the tree will take you to a new tree page with that nested tree
                as the root!
              </div>
            </div>
            <div className="prettySlider">
              <div className="prettySliderImg"></div>
              <div className="prettySliderText">
                This button is the secret to creating a tree structure that
                everybody talks about. Clicking this button restructures your
                tree into a structured behemoth.
              </div>
            </div>
            <div className="beforePretty">
              <div className="beforePrettyImg"></div>
              <div className="beforePrettyText">
                Here's an example! Before an unstructured mess you wouldn't want
                to introduce to your mother, or Uncle Jonny.
              </div>
            </div>
            <div className="afterPretty">
              <div className="afterPrettyImg"></div>
              <div className="afterPrettyText">
                And after... a dazzling, respectful structure ready to go! Wow!
              </div>
            </div>
            <div className="userSidebar">
              <div className="userImg"></div>
              <div className="userText">
                To maximise your productivity, you can also customise the canvas
                and node colours! Make sure you save your unique aesthetic!
              </div>
            </div>
            <div className="deleteNodeSlider">
              <div className="deleteSliderImg"></div>
              <div className="deleteSliderText">
                Lastly is the delete button. This button will appear on the
                sidebar when a node is clicked on the page. Use this to remove a
                node and all of its children from the page. Be careful though!
                Once delete you cannot go back (apparently undo wasn't flash
                enough for marks).
              </div>
            </div>
          </Flickity>
        </Modalant>
      </div>
    );
  }
}

export default HelperButton;

import React from "react";
import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import Textarea from "@atlaskit/textarea";
import Modal from "@atlaskit/modal-dialog";
import styled from "styled-components";
import Button, { ButtonGroup } from "@atlaskit/button";
import "./Tree.css"; 

import { CirclePicker } from 'react-color';
import reactCSS from 'reactcss';


function ColourPallete(props) {
  const canvasColour = props.colorCanvas;
  const handleCanvasChange = props.handleCanvasChange;
  const handleCanvasChangeComplete = props.handleCanvasChangeComplete;

  const nodeColour = props.nodeColour;
  const handleNodeChange = props.handleNodeChange;
  const handleNodeChangeComplete = props.handleNodeChangeComplete;

  const queueColour = props.queueColour;
  const handleQueueChange = props.handleQueueChange;
  const handleQueueChangeComplete = props.handleQueueChangeComplete;

  const canvasStyles = reactCSS({
    'default': {
      color: {
        width: '150px',
        height: '30px',
        borderRadius: '2px',
        background: `rgba(${ canvasColour.r }, ${ canvasColour.g }, ${ canvasColour.b }, ${ canvasColour.a })`,
      },
      swatchCanvas: {
        padding: '3px',
        background: '#f5f5f5',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
      },
    },
  });

  const nodeStyles = reactCSS({
    'default': {
      color: {
        width: '100px',
        height: '20px',
        borderRadius: '10px',
        background: `rgba(${ nodeColour.r }, ${ nodeColour.g }, ${ nodeColour.b }, ${ nodeColour.a })`,
      },
      swatchNode: {
        padding: '2px',
        background: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
      },
    },
  });

    const queueStyles = reactCSS({
    'default': {
      color: {
        width: '100px',
        height: '20px',
        borderRadius: '10px',
        background: `rgba(${ queueColour.r }, ${ queueColour.g }, ${ queueColour.b }, ${ queueColour.a })`,
      },
      swatchQueue: {
        padding: '2px',
        background: '#f5f5f5',
        borderRadius: '10px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
      },
    },
  });

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CirclePicker
          color={canvasColour}
          onChange={handleCanvasChange}
          onChangeComplete={handleCanvasChangeComplete}
        />
      </div>

      <br/>

      <div> Selected Canvas Colour: </div>

      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={ canvasStyles.swatchCanvas }>
          <div style={ canvasStyles.color } />
        </div>
      </div>
      <br/>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <div>
          Select a new node colour.
          <br/>
          <br/>
          <CirclePicker
            color={nodeColour}
            onChange={handleNodeChange}
            onChangeComplete={handleNodeChangeComplete}
          />
          <br/>
          Selected node colour:

          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div style={ nodeStyles.swatchNode }>
              <div style={ nodeStyles.color } />
            </div>
          </div>

        </div>
        <div>
          Select a new queue colour.
          <br/>
          <br/>
          <CirclePicker 
            color={queueColour}
            onChange={handleQueueChange}
            onChangeComplete={handleQueueChangeComplete}
          />
          <br/>
          Selected queue colour:
          
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div style={ queueStyles.swatchQueue }>
              <div style={ queueStyles.color } />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};


export class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorCanvas: {
        r: '245',
        g: '245',
        b: '245',
        a: '1',
      },
      nodeColour: {
        r: '245',
        g: '245',
        b: '245',
        a: '1',
      },
      queueColour: {
        r: '245',
        g: '245',
        b: '245',
        a: '1',
      },
    };
    this.handleCanvasChange = this.handleCanvasChange.bind(this);
    this.handleCanvasChangeComplete = this.handleCanvasChangeComplete.bind(this);

    this.handleNodeChange = this.handleNodeChange.bind(this);
    this.handleNodeChangeComplete = this.handleNodeChangeComplete.bind(this);

    this.handleQueueChange = this.handleQueueChange.bind(this);
    this.handleQueueChangeComplete = this.handleQueueChangeComplete.bind(this);

  };

  defaultColour = () => {
    this.props.onSave(
      {   
        canvasBackground: "#f5f5f5",
        nodeBackground: "#fa7c92",
        queueBackground: "#6ec4db",

      },
    );
  };

  handleCanvasChangeComplete = (colorCanvas) => {
    this.setState({ canvasBackground: colorCanvas.hex});
  };
  handleCanvasChange = (colorCanvas) => {
    this.setState({ colorCanvas: colorCanvas.rgb });
  };

  handleNodeChangeComplete = (nodeColour) => {
    this.setState({ nodeBackground: nodeColour.hex});

  };
  handleNodeChange = (nodeColour) => {
    this.setState({ nodeColour: nodeColour.rgb });
  };

  handleQueueChangeComplete = (queueColour) => {
    this.setState({ queueBackground: queueColour.hex});
  };
  handleQueueChange = (queueColour) => {
    this.setState({ queueColour: queueColour.rgb });
  };


  handleClick = () => {
    console.log("handleclick returns");
    console.log(this.state);
    this.props.onSave(this.state);
  }

  render()  {
    const { onClose, onSave} = this.props;
    return (
      <Modal
        heading={"Customise your canvas here."}
        autoFocus={true}
      >
      <div>
      Select a new canvas background colour.
      </div>
      <br/>
      <ColourPallete
        handleCanvasChange={this.handleCanvasChange}
        handleCanvasChangeComplete={this.handleCanvasChangeComplete}
        colorCanvas={this.state.colorCanvas}

        handleNodeChange={this.handleNodeChange}
        handleNodeChangeComplete={this.handleNodeChangeComplete}
        nodeColour={this.state.nodeColour}

        handleQueueChange={this.handleQueueChange}
        handleQueueChangeComplete={this.handleQueueChangeComplete}
        queueColour={this.state.queueColour}
      >
      </ColourPallete>
      <div
          style={{
          marginLeft: '15px',
          marginTop: '30px',
        }}
      >
        <Button
          appearance={'warning'}
          onClick={this.defaultColour}
        >
          Revert to default
        </Button>
      </div>
      <div
          style={{
          marginLeft: '405px',
          marginTop: '-32px',
        }}
      >
        <ButtonGroup>
          <Button 
            appearance={'primary'}
            onClick={this.handleClick}
          >
            Save
          </Button>
          <Button 
            appearance={'danger'}
            onClick={
              onClose
            }
          >
            Cancel
          </Button>
        </ButtonGroup>
        <br/>
      </div>
      <br/>
      </Modal>
    );

  };
}

import React, { Component } from "react";
import { Modal, Form, Input } from "antd";

//Purposefully abstracted more of the props so that we can reuse this form for editing.
const TreeForm = Form.create({ name: "tree-form" })(
  class extends Component {
    render() {
      const {
        visible,
        onOk,
        onCancel,
        title,
        okText,
        form,
        preFill,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          title={title}
          okText={okText}
        >
          <div className="tree-form">
            <Form layout="vertical">
              <Form.Item label="Name">
                {getFieldDecorator("Name", {
                  initialValue: preFill ? preFill.name : null,
                  rules: [
                    {
                      required: true,
                      message: "Please name your Tree! Maximum 40 characters",
                      max: 40,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Description">
                {getFieldDecorator("Description", {
                  initialValue: preFill ? preFill.description : null,
                  rules: [{ required: false, message: "Description..." }],
                })(<Input />)}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      );
    }
  }
);

export default TreeForm;

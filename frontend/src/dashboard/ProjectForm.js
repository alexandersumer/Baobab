import React, { Component } from 'react';
import { Modal, Form, DatePicker, Input, TimePicker } from 'antd';
import moment from 'moment'

//Purposefully abstracted more of the props so that we can reuse this form for editing.
const ProjectForm = Form.create({ name: 'project-form' })(
  class extends Component {
    render() {
      const { visible, onOk, onCancel, title, okText, form, preFill } = this.props;
      const { getFieldDecorator } = form;
      return (
          <Modal
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            title={title}
            okText={okText}
          >
            <div className="project-form">
            <Form layout='vertical'>
              <Form.Item label='Name'>
                {getFieldDecorator('Name', {
                  initialValue: preFill ? preFill.name : null,
                  rules: [{required: true, message: 'Please name your project! Maximum 40 characters', max: 40}],
                })(<Input />)}
              </Form.Item>
              <Form.Item label='Date'>
                {getFieldDecorator('Date', {
                  initialValue: preFill ? moment(preFill.beginTime._seconds * 1000) : null,
                  rules: [{ required: true, message: 'Please set a date for the project!' }],
                })(<DatePicker format='DD/MM/YYYY' />)}
              </Form.Item>
              <span>
                <Form.Item label='Start Time'>
                  {getFieldDecorator('Start', {
                    initialValue: preFill ? moment(preFill.beginTime._seconds * 1000) : null,
                    rules: [{ required: true, message: 'Please set a start time!' }],
                  })(<TimePicker minuteStep={15} format='HH:mm' />)}
                </Form.Item>
                <Form.Item label='End Time'>
                  {getFieldDecorator('End', {
                    initialValue: preFill ? moment(preFill.endTime._seconds * 1000) : null,
                    rules: [{ required: true, message: 'Please set an end time!' }],
                  })(<TimePicker minuteStep={15} format='HH:mm' />)}
                </Form.Item>
              </span>
              <Form.Item label='Location'>
                {getFieldDecorator('Location', { initialValue: preFill ? preFill.location : null,
                  rules: [{ required: true, message: 'Please enter a location!' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label='Description'>
                {getFieldDecorator('Description', { initialValue: preFill ? preFill.description : null,
                  rules: [{ required: false, message: 'Description...' }],
                })(<Input />)}
              </Form.Item>
            </Form>
            </div>
          </Modal>
      );
    }
  }
);

export default ProjectForm;

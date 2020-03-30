import {Button, Input, Form} from 'antd';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import firebase from '../firebase';

import './ProjectCodeForm.css';
import './Landing.css';

class ProjectCodeForm extends Component {
  state = {
    code: '',
    codeStatus: '',
    codeMessage: '',
  };

  handleChange = (project) => {
    this.setState({code: project.target.value});
  };

  handleCode = async (project) => {
    project.preventDefault();
    this.setState({codeStatus: 'validating', codeMessage: ''});

    await firebase.whenAuthReady();
  };

  render() {
    return (
      <Form className='code-form' onSubmit={this.handleCode}>
        <Form.Item
          hasFeedback
          validateStatus={this.state.codeStatus}
          help={this.state.codeMessage || ''}
        >
          <Input placeholder='#   Project code' id='validating'
                 value={this.state.code} onChange={this.handleChange}/>
        </Form.Item>
        <Button type='primary' large htmlType='submit'>
          GO
        </Button>
      </Form>
    )
  }
}

export default withRouter(ProjectCodeForm);

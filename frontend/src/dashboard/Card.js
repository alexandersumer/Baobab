import {Dropdown, Icon, Menu, message, Popconfirm, Tag} from 'antd';
import {firestore} from 'firebase';
import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import firebase from '../firebase';

import ProjectForm from './ProjectForm';
import {formatDate, timeStampToDate} from '../components/util';

import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      livestreamSetupVisible: false,
      inviteFlowVisible: false,
    };
  }

  //===Update Project===//
  showModal = () => {
    this.setState({ visible: true, });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleOk = e => {
    const {form} = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      // Temporary to allow for testing.
      if (!firebase.isAuthenticated()) {
        firebase.doSignInAnonymously();
      }

      message.info('Updating project...');

      const dateMoment = form.getFieldValue('Date');
      const startMoment = form.getFieldValue('Start');
      const endMoment = form.getFieldValue('End');

      const startDate = new Date(
        dateMoment.year(), dateMoment.month(), dateMoment.date(),
        startMoment.hour(), startMoment.minute()
      );
      const endDate = new Date(
        dateMoment.year(), dateMoment.month(), dateMoment.date(),
        endMoment.hour(), endMoment.minute()
      );
      firebase.getFunctionsInstance().httpsCallable('UpdateProject')({
        id: this.props.record.id,
        name: form.getFieldValue('Name'),
        beginTime: firestore.Timestamp.fromDate(startDate),
        endTime: firestore.Timestamp.fromDate(endDate),
        location: form.getFieldValue('Location'),
        description: form.getFieldValue('Description')
      })
      .then(() => {
        message.success('Updated project', 3);
        form.resetFields();
        this.setState({visible: false,});
        this.props.getProjectsHook();
      })
      .catch((error) => {
        message.error('Failed to update project with error: ' + error.message, 3);
      });
    });
  };

  handleCancel = e => {
    console.log(e);
    message.error('Project not updated', 2);
    this.setState({ visible: false, });
  };

  //===Non-Owner Menu===//
  handleLeaveCancel = e => {
    message.info('Project not left',2);
  };

  handleLeaveConfirm = e => {
    this.props.deleteProject(this.props.record.id);
    firebase.getFunctionsInstance().httpsCallable('LeaveProject')({
      projectID: this.props.record.id
    })
    .then(() => {
      message.success('Left project ' + this.props.record.name, 3);
    })
    .catch((error) => {
      message.error('Failed to leave project with error: ' + error.message, 3);
    });
  };

  nonOwnerMenu = (
    <Menu>
      <Menu.Item key='1'>
        <Popconfirm
          title='Are you sure you want to leave this project?'
          onConfirm={this.handleLeaveConfirm}
          onCancel={this.handleLeaveCancel}
          okText='Leave Project'
          cancelText='Cancel'
        >
          Leave
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  //===Owner Menu===//
  handleDeleteConfirm = () => {
    this.props.deleteProject(this.props.record.id);
    firebase.getFunctionsInstance().httpsCallable('DeleteProject')({
      projectID: this.props.record.id
    })
    .then(() => {
      message.success('Project deleted: ' + this.props.record.name, 3);
    })
    .catch((error) => {
      message.error('Failed to delete project with error: ' + error.message, 3);
    });
  };
  
  handleDeleteCancel = () => {
    message.info('Project not deleted', 2);
  };
  
  ownerMenu = () => (
    <Menu>
      <Menu.Item key='1' onClick={this.showModal}>
        Edit
      </Menu.Item>
      <Menu.Item key='2'>
        <Link to={"/analytics/" + this.props.record.id}>
          Analytics
        </Link>
      </Menu.Item>
      <div className='card-divider'/>
      <Menu.Item key='5' style={{backgroundColor:'#ff4d4f', color:'#fff'}}>
        <Popconfirm
          title='Deleting an project cannot be undone!'
          onConfirm={this.handleDeleteConfirm}
          onCancel={this.handleDeleteCancel}
          okText='Delete Project'
          cancelText='Cancel'
        >
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  render() {
    let startDate = timeStampToDate(this.props.record.beginTime);
    let endDate = timeStampToDate(this.props.record.endTime);
    return (
      <div>
        {!this.props.record.membership.includes(this.props.filter) && this.props.filter !== 'none' ? null :
        <div className='card'>
          <Link className='card-link' key={this.props.record.id} to={'/project/' + this.props.record.id}>
          <div className='icon-block'>
            <img
              alt={this.props.altText}
              src={this.props.iconPath}
            />
          </div>
          <div className='info-block'>
            <div className='project-title'>
              <h3>{this.props.record.name}</h3>
              {this.props.record.membership.includes('organiser') && <p className='light'>#{this.props.record.code}</p>}
            </div>
            <div className='card-timestamp'>
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>
          </div>
          <div className='tag-block'>
            {this.props.record.membership.map(tag => {
              let colour = 'geekblue';
              if (tag === 'organiser') {
                colour = 'green';
              } else if (tag === 'moderator') {
                colour = 'volcano';
              }
              return (
              <Tag color={colour} key={tag}>
                {tag.charAt(0).toUpperCase() + tag.substr(1)}
              </Tag>
              );
            })}
          </div>
          </Link>
          <div className='menu-ellipses'>
            <Dropdown overlay={this.props.record.membership.includes('organiser') ? 
              this.ownerMenu
              :
              this.nonOwnerMenu
              }
              trigger={['click']}
              >
              <Icon type='more' style={{ fontSize: '25px', }} />
            </Dropdown>
            <ProjectForm
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                title='Edit Project'
                okText='Update Project'
                wrappedComponentRef={this.saveFormRef}
                preFill={this.props.record}
              />
          </div>
        </div>
        }
      </div>
    )
  }
}

export default withRouter(Card);

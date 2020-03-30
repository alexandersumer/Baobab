import {Alert, Button, message, Dropdown, Menu, Icon} from 'antd';
import {firestore} from 'firebase';
import React, {Component} from 'react';
import QueueAnim from 'rc-queue-anim';

import Card from './Card';
import ProjectForm from './ProjectForm';
import firebase from '../firebase';

import './Dashboard.css';
import Skeleton from "../components/Skeleton";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true,
      pastProjects: [],
      filter: 'none'
    };
    this.observeAuthChange();
    this.deleteProject = this.deleteProject.bind(this);
  }

  showModal = () => {
    this.setState({visible: true,});
  };

  handleOk = e => {
    const {form} = this.formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      message.info('Creating new project...');

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

      await firebase.whenAuthReady();

      firebase.getFunctionsInstance().httpsCallable('CreateNewProject')({
        name: form.getFieldValue('Name'),
        beginTime: firestore.Timestamp.fromDate(startDate),
        endTime: firestore.Timestamp.fromDate(endDate),
        location: form.getFieldValue('Location'),
        description: form.getFieldValue('Description')
      })
        .then((result) => {
          message.success('Successfully created new project with code: ' + result.data.code, 3);
          form.resetFields();
          this.setState({visible: false,});
          this.getProjects();
        })
        .catch((error) => {
          message.error('Failed to create new project with error: ' + error.message, 3);
        });
    });
  };

  handleCancel = e => {
    console.log(e);
    message.error('No project made', 2);
    this.setState({visible: false,});
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  getProjects = async () => {
    await firebase.whenAuthReady();

    firebase.getFunctionsInstance().httpsCallable('GetProjectList')()
      .then((result) => {
        this.setState({
          pastProjects: result.data.currentProjects.concat(result.data.pastProjects),
          loading: false
        });
      })
      .catch((error) => {
        message.error('Failed to get projects with error: ' + error.message, 3);
      });
  };

  deleteProject(id) {
    this.setState(state => ({
      pastProjects: state.pastProjects.filter(project => !(project.id === id))
    }));
  }

  observeAuthChange() {
    firebase.onAuthStateChanged((user) => {
      if (user) this.getProjects();
    });
  }

  handleFilter(project) {
    this.setState({
      filter: project.key,
    });
  }

  render() {
    return (
      <div className='parentContainer'>
        <div className='halfWidthContainer'>
          <h1>My Projects</h1>
          <br/>
          <div>
            <div className='buttonBar'>
              {this.props.authUser &&
              <Button type='primary'
                      style={{float: 'right', backgroundColor: '#59d08f', borderColor: '#59d08f', fontWeight: 'bold'}}
                      onClick={this.showModal}
              >+ New Project</Button>
              }
            </div>
            <br/>
            <ProjectForm
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              title='New Project'
              okText='Create Project'
              wrappedComponentRef={this.saveFormRef}
            />
          </div>
          {this.state.loading ? <Skeleton/> :
            (<QueueAnim className="questions">
              {this.state.pastProjects.map(record =>
                <Card key={record.id}
                      record={record}
                      altText='active project'
                      iconPath={require('../img/project-active-icon.svg')}
                      getProjectsHook={this.getProjects}
                      deleteProject={this.deleteProject}
                      filter={this.state.filter}
                />
              )}
            </QueueAnim>)
          }
          {this.state.pastProjects.length < 1 && !this.state.loading && <p className='no-projects'>No projects</p>}
        </div>
      </div>
    )
  }
}

export default Dashboard;

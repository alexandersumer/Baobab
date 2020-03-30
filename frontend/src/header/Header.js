import { Button, Dropdown, Icon, Menu, Modal, message } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import firebase from '../firebase';
import { withRouter } from "react-router-dom";

import ProjectCodeForm from '../landing/ProjectCodeForm';
import SignIn from "../auth/SignIn";

import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectModalVisible: false,
      signInModalVisible: false,
    };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.history.push("/");
    //TODO: actually check they logged out successfully.
    firebase.doSignOut();
    message.success("Logged out successfully.");
  }

  setProjectModalVisible(projectModalVisible) {
    this.setState({ projectModalVisible });
  }

  setSignInModalVisible(signInModalVisible) {
    this.setState({ signInModalVisible });
  }

  dropdownMenu = () => (
    <Menu>
      <Menu.Item key='1'>
        <Link to='/dashboard'>
          My Projects
        </Link>
      </Menu.Item>
      {
        <Menu.Item onClick={this.signOut} key='4'>
          Sign Out
        </Menu.Item>
      }
    </Menu>
  );

  render() {
    return (
      <div className='header-wrap'>
        <div className='logo'>
          <Link to='/'>
            <img
              alt='logo'
              src={require('../img/logo.svg')}
            />
          </Link>
        </div>
        <div className='rhs-buttons'>
          <Button onClick={() => this.setProjectModalVisible(true)} size={'large'}>Go to a Project</Button>
          <Modal
            title='Go to Project'
            style={{ top: 20 }}
            visible={this.state.projectModalVisible}
            onOk={() => this.setProjectModalVisible(false)}
            onCancel={() => this.setProjectModalVisible(false)}
            footer={null}
          >
            <ProjectCodeForm doClose={() => this.setProjectModalVisible(false)} />
          </Modal>
          <Modal
            title='Sign in or Register'
            style={{ top: 20 }}
            visible={this.state.signInModalVisible}
            onOk={() => this.setSignInModalVisible(false)}
            onCancel={() => this.setSignInModalVisible(false)}
            footer={null}
          >
            <SignIn signInSuccessCallback={() => this.setSignInModalVisible(false)} redirect={true} />
          </Modal>
          {!this.props.authUser &&
            <Button size={'large'} onClick={() => this.setSignInModalVisible(true)}>Sign In</Button>
          }
          {this.props.authUser &&
            <div className='logged-in'>
              <Dropdown overlay={this.dropdownMenu}>
                <a href='# '>
                  <Icon type='user' />
                  {this.props.authUser && this.props.displayName}
                  <Icon type='down' />
                </a>
              </Dropdown>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Header);

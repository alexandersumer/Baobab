import { Button, Modal } from 'antd';
import QueueAnim from 'rc-queue-anim';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Landing.css';
import SignIn from "../auth/SignIn";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInModalVisible: false,
    };
  }

  setSignInModalVisible(signInModalVisible) {
    this.setState({ signInModalVisible });
  }

  render() {
    return (
      <div>
        <div className='landing-header'>
          <div className='logo'>
            <img
              alt='logo'
              src={require('../img/logo.png')}
            />
          </div>
          {this.props.authUser ?
            <div className='landing-buttons'>
              <Link to='/dashboard'><Button size='large'>My Projects</Button></Link>
            </div>
            :
            <div className='landing-buttons'>
              <Modal
                title='Sign in or Register'
                style={{ top: 20 }}
                visible={this.state.signInModalVisible}
                onOk={() => this.setSignInModalVisible(false)}
                onCancel={() => this.setSignInModalVisible(false)}
                footer={null}
              >
                <SignIn signInSuccessCallback={() => this.setSignInModalVisible(false)} redirect={false} />
              </Modal>
              <Button size={'large'} onClick={() => this.setSignInModalVisible(true)}>Register or Sign In</Button>
            </div>
          }
        </div>
        <div className='banner'>
          <div className='banner-text'>
            <QueueAnim type='bottom' delay={150}>
              <h1>Plan your journey.</h1>
              <br />
            </QueueAnim>
          </div>
        </div>
        <div className='page-1'>
          <div className='page-1-heading'>
            <h1>Create trees, queues, kanbans and chat to the tree now.</h1>
          </div>
          <div className='page-1-boxes'>
            <div className='page-1-box'>
              <img
                alt='engagement illustration'
                src={require('../img/tree.svg')}
              />
              <h2>Create trees</h2>
              <p>Trees allow you to structure your concurrent goals hierarchically and provide a big picture view.</p>
            </div>
            <div className='page-1-box'>
              <img
                alt='open communication illustration'
                src={require('../img/queue.svg')}
              />
              <h2>Create queues</h2>
              <p>Queues allow you to organise your gials sequentiality in priority order to maximise efficiency.</p>
            </div>
            <div className='page-1-box'>
              <img
                alt='live feedback illustration'
                src={require('../img/kanban.svg')}
              />
              <h2>Create kanban boards</h2>
              <p>Kanbans allow you to be in control and get the day-to-day execution of workitems done.</p>
            </div>
          </div>
        </div>
        <div>
          <br />
          <br />
          <br />
          <br />
        </div>
        <div className='page-1'>
          <div className='page-1-heading'>
            <h1>The ultimate planning platform.</h1>
            <p>Get the best of both worlds: a big picture tree view for long term planning and a detailed kanban view for the day to day execution of tasks.</p>
          </div>
          <div className='page-1-boxes'>
            <div className='page-1-box'>
              <img
                alt='engagement illustration'
                src={require('../img/landing-icon-1.svg')}
              />
              <h2>Move work forward</h2>
              <p>Finding the right balance between sequentiality and asynchrony is a characteristic of efficient people.</p>
            </div>
            <div className='page-1-box'>
              <img
                alt='open communication illustration'
                src={require('../img/landing-icon-2.svg')}
              />
              <h2>Chat to the tree</h2>
              <p>Baobab comes equipped with a state-of-the-art machine learning chatbot.</p>
            </div>
            <div className='page-1-box'>
              <img
                alt='live feedback illustration'
                src={require('../img/landing-icon-3.svg')}
              />
              <h2>Get inspired</h2>
              <p>Get crucial tips and tricks from the talking tree to cultivate your full potential.</p>
            </div>
          </div>
        </div>
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    )
  }
}

export default Landing;

import {message} from 'antd';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import firebaseInstance from '../firebase';

import './SignIn.css';

class SignIn extends Component {
  componentDidMount() {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          message.success('Successfully signed in. Redirecting...');
          return true;
        },
        signInFailure: (error) => {
          if (error.code === 'firebaseui/anonymous-upgrade-merge-conflict') {
            const anonUID = firebaseInstance.getCurrentUser().uid;
            
            return firebaseInstance.doSignInWithCredential(error.credential).then(() => {
              return firebaseInstance.getFunctionsInstance().httpsCallable('MergeUsers')({oldUID: anonUID});
            })
            .then(() => {
              this.props.history.push('/dashboard');
              this.props.signInSuccessCallback();
            })
            .catch(() => {
            });
          } else {
            message.error('Error in signing in: ' + error);
          }
        },
        uiShown: () => {
        }
      },

      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],

      credentialHelper: firebaseui.auth.CredentialHelper.NONE,

      signInFlow: 'popup',

      signInSuccessUrl: '/dashboard',

      autoUpgradeAnonymousUsers: true
    };

    firebaseInstance.authUI.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    return (
      <div id="firebaseui-auth-container"></div>
    )
  }
};

export default withRouter(SignIn);
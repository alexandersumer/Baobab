import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import { message } from "antd";

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "baobab-82803.firebaseapp.com",
  databaseURL: "https://baobab-82803.firebaseio.com",
  projectId: "baobab-82803",
  storageBucket: "baobab-82803.appspot.com",
  messagingSenderId: "398776449818",
  appId: "1:398776449818:web:a2c72c80432d0e0d9c0aa3",
  measurementId: "G-7WDBS302GC",
};

class Firebase {
  constructor() {
    this.functions = app
      .initializeApp(firebaseConfig)
      .functions("asia-northeast1");
    this.auth = app.auth();
    this.setAuthReadyPromise_();
    this.authUI = new firebaseui.auth.AuthUI(this.auth);

    try {
      this.messaging = firebase.messaging();
      this.messaging.usePublicVapidKey(
        "BNBR7rJpSKHf19wnTfpuNdQPfdsjMuGKDz18fbmKxdKkfik-YCcv3Np97ZlMKKTvjrPl9hgb0qQecrRuXei8cLU"
      );
      this.messagingToken = null;
    } catch {
      this.messaging = null;
    }

    // MAKE SURE TO CHANGE THE BELOW TO WHEREVER YOUR CLOUD FUNCTIONS ARE HOSTED
    // if (window.location.hostname === "localhost") {
    //   this.functions.useFunctionsEmulator("http://localhost:5001");
    // }
  }

  setAuthReadyPromise_() {
    this.authReady = new Promise((resolve, reject) => {
      this.setSignInOnAuthReady_(resolve);
    });
  }

  setSignInOnAuthReady_(onReady) {
    const unsubscribe = this.auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (!user)
        this.doSignInAnonymously().then((credential) =>
          onReady(credential.user)
        );
      else onReady(user);
    });
  }

  doSignInAnonymously() {
    return this.auth.signInAnonymously();
  }

  doSignInWithCredential(credential) {
    return this.auth.signInWithCredential(credential);
  }

  doSignOut() {
    this.auth.signOut();
  }

  doPasswordUpdate(password) {
    this.auth.currentUser.updatePassword(password);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getDisplayName() {
    if (!this.isAuthenticated() || this.isAnonymouslyAuthenticated())
      return "Anonymous";
    return (
      this.auth.currentUser.displayName ||
      this.auth.currentUser.providerData[0].displayName
    );
  }

  getAvatar() {
    if (!this.isAuthenticated() || this.isAnonymouslyAuthenticated())
      return null;
    return (
      this.auth.currentUser.photoURL ||
      this.auth.currentUser.providerData[0].photoURL
    );
  }

  getFirestoreInstance() {
    return app.firestore();
  }

  getFunctionsInstance() {
    return this.functions;
  }

  getMessagingInstance() {
    return this.messaging;
  }

  isAuthenticated() {
    return !!this.auth.currentUser;
  }

  isAnonymouslyAuthenticated() {
    if (!this.isAuthenticated()) return false;
    return this.auth.currentUser.isAnonymous;
  }

  async monitorMessagingToken() {
    if (this.messaging === null) return;
    if (this.messagingToken !== null) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      message.error("Notification permission was not granted.");
    }

    const getToken = async () => {
      try {
        const token = await this.messaging.getToken();
        if (token) {
          await this.functions.httpsCallable("StoreFCMToken")({
            oldToken: this.messagingToken,
            newToken: token,
          });
          this.messagingToken = token;
        }
      } catch (error) {
        console.error("FCM Token Error: ", error);
      }
    };

    getToken();
    this.messaging.onTokenRefresh(getToken);
  }

  whenAuthReady() {
    return this.authReady;
  }

  onAuthStateChanged(observer, error = undefined) {
    return this.auth.onAuthStateChanged(observer, error);
  }
}

export default new Firebase();

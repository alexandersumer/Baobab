import app from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCMD25W1UqvpW-kJm--SJMUsvyJP_72Trc",
    authDomain: "baobab-35c48.firebaseapp.com",
    databaseURL: "https://baobab-35c48.firebaseio.com",
    projectId: "baobab-35c48",
    storageBucket: "baobab-35c48.appspot.com",
    messagingSenderId: "985082400283",
    appId: "1:985082400283:web:e48c4bf828c82f7e2df2be",
    measurementId: "G-7GKL86PR7M"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
    }
}

export default Firebase;
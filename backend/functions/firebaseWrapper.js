const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

exports.getFirestoreInstance = () => {
    return admin.firestore();
};

exports.getAuthInstance = () => {
    return admin.auth();
};
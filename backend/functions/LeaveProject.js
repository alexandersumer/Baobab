const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.LeaveProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to leave this project.');
  }
  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The Project ID must be non-empty');
  }
  if (context.auth.uid === null || context.auth.uid === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The User ID must be non-empty');
  }
  
  const projectRef = firestore.collection('projects').doc(data.projectID);
  const userRef = firestore.collection('users').doc(context.auth.uid);
  
  return projectRef.update({
      participantIDs: admin.firestore.FieldValue.arrayRemove(context.auth.uid),
      moderatorIDs: admin.firestore.FieldValue.arrayRemove(context.auth.uid)
    })
    .then(() => {
      console.log('User removed from project successfully');
      return userRef.collection('projects').doc(data.projectID).delete();
    })
    .then(() => {
      console.log('Project removed from user successfully');
      return {};
    })
    .catch(error => {
      if (error instanceof functions.https.HttpsError) throw error;
      console.error('Failed to leave project: ', data.projectID, error);
      throw new functions.https.HttpsError('unknown', 'An unknown error occurred in leaving project.', error);
    });
});
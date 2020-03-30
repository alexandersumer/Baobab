const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.JoinProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You don\'t have permission to join this project.');
  }

  if (data.code === null) {
    throw new functions.https.HttpsError('invalid-argument', 'The project code must be provided.')
  }

  let projectDocument;

  return firestore.collection('projects').where('code', '==', data.code).get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      console.log('User with uid ', context.auth.uid, ' tried to join invalid project code ', data.code);
      throw new functions.https.HttpsError('not-found', 'This project code is invalid or you don\'t have permission to join this project.');
    }

    projectDocument = querySnapshot.docs[0];

    return firestore.collection('users').doc(context.auth.uid).collection('projects').doc(projectDocument.id).get();
  })
  .then((doc) => {
    if (doc.exists) {
      return Promise.resolve();
    }

    return firestore.collection('users').doc(context.auth.uid).collection('projects').doc(projectDocument.id).set({
      projectRef: firestore.collection('projects').doc(projectDocument.id),
      beginTime: projectDocument.data().beginTime,
      endTime: projectDocument.data().endTime,
      role: 'participant',
      rating: null,
    });
  })
  .then(() => {
    return firestore.collection('projects').doc(projectDocument.id).update({
      participantIDs: admin.firestore.FieldValue.arrayUnion(context.auth.uid)
    });
  })
  .then(() => {
    console.log('User with uid ', context.auth.uid, ' successfully joined project ', projectDocument.id);
    return {
      success: true,
      projectID: projectDocument.id
    };
  })
  .catch((error) => {
    if (error instanceof functions.https.HttpsError) throw error;
    console.error('Failed to join an project, error: ', error);
    throw new functions.https.HttpsError('unknown', 'An unknown error occurred in joining the project.');
  });
});

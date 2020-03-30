const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.DeleteProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }
  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The Project ID must be non-empty');
  }
  
  const projectRef = firestore.collection('projects').doc(data.projectID);

  return projectRef.get()
  .then(snapshot => {
    let promises = [];
    snapshot.data().participantIDs.forEach(user => {
      promises.push(firestore.collection('users').doc(user));
    });
    return Promise.all(promises);
  })
  .then(users => {
    for (let key in users) {
      users[key].collection('projects').doc(data.projectID).delete();
    }
    return projectRef.collection('nodes').get();
  })
  .then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
    projectRef.delete();
    return {};
  })
  .catch(error => {
    if (error instanceof functions.https.HttpsError) throw error;
    console.error('Failed to delete project: ', data.projectID, error);
    throw new functions.https.HttpsError('unknown', 'An unknown error occurred in deleting the project.', error);
  });
});

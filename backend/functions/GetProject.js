const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.GetProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to view this project.');
  }

  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The Project ID must be non-empty');
  }

  const projectRef = firestore.collection('projects').doc(data.projectID);

  return projectRef.get()
    .then(snapshot => {
      if (!snapshot.exists || !snapshot.data().participantIDs.includes(context.auth.uid)) {
        throw new functions.https.HttpsError('not-found',
          'The Project ID was not found or you were not authorised to access it.');
      }
      let project = snapshot.data();
      project.projectID = data.projectID;
      if (!snapshot.data().organiserIDs.includes(context.auth.uid)) {
        delete project.code;
        delete project.moderatorIDs;
        delete project.participantIDs;
      }
      return project;
    })
    .catch(error => {
      if (error instanceof functions.https.HttpsError) throw error;
      console.error('Failed to get project: ', data.projectID, error);
      throw new functions.https.HttpsError('unknown', 'An unknown error occurred in getting project.', error);
    });
});

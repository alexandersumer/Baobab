const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.UpdateNode = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (data.nodeID === null || data.nodeID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'A nodeID must be provided.')
  }

  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'An projectID must be provided.')
  }

  if (data.content === null || data.content === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The node must contain content.')
  }

  const docRef = firestore.collection('projects').doc(data.projectID).collection('nodes').doc(data.nodeID);

  return docRef.update({
    content: data.content,
  })
    .then(() => {
      console.log('Node updated successfully');
      return {};
    })
    .catch((error) => {
      console.error('Failed to update node, error: ', error);
      throw new functions.https.HttpsError('unknown', error);
    });
});

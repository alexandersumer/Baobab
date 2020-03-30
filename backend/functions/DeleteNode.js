const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.DeleteNode = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }
  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The Project ID must be non-empty');
  }
  if (data.nodeID === null || data.nodeID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The Node ID must be non-empty');
  }
  
  const nodeRef = firestore.collection('projects').doc(data.projectID).collection('nodes').doc(data.nodeID);
  
  return nodeRef.delete()
    .then(() => {
      console.log('Node deleted successfully');
      return {};
    })
    .catch(error => {
      if (error instanceof functions.https.HttpsError) throw error;
      console.error('Failed to delete node: ', data.nodeID, error);
      throw new functions.https.HttpsError('unknown', 'An unknown error occurred in deleting the node.', error);
    });
});
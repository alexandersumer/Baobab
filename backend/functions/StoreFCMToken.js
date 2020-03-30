const admin = require('firebase-admin');
const functions = require('firebase-functions');
const firestore = require('./firebaseWrapper').getFirestoreInstance();

exports.StoreFCMToken = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (data.newToken === null || data.newToken === '') {
    throw new functions.https.HttpsError('invalid-argument', 'An new token must be provided.');
  }

  const userRef = firestore.collection('users').doc(context.auth.uid);
  let userData;
  return userRef.get().then(snapshot => {
    userData = snapshot.data();

    if (userData.FCMTokens === undefined) {
      return userRef.update({ FCMTokens: [] });
    }

    return Promise.resolve();
  })
  .then(() => {
    if (data.oldToken !== null && data.oldToken !== '') {
      return userRef.update({ FCMTokens: admin.firestore.FieldValue.arrayRemove(data.oldToken) });
    }

    return Promise.resolve();
  })
  .then(() => {
    return userRef.update({ FCMTokens: admin.firestore.FieldValue.arrayUnion(data.newToken) });
  })
  .then(() => {
    return userRef.collection('projects').get();
  })
  .then(querySnapshot => {
    querySnapshot.forEach(projectDoc => {
      if (data.oldToken !== null && data.oldToken !== '') 
        admin.messaging().unsubscribeFromTopic(data.oldToken, projectDoc.id);
      admin.messaging().subscribeToTopic(data.newToken, projectDoc.id);
    });

    return {};
  })
  .catch((error) => {
    console.error('Failed to store FCM token, error: ', error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError('unknown', 'An unknown error occurred in storing the FCM token, ' + error);
  });
});
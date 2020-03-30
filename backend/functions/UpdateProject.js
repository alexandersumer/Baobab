const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.UpdateProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null || context.auth.token.sign_in_provider === 'anonymous') {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to update an project.');
  }

  if (data.name === null || data.name === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The project must have a non empty name.')
  }

  if (data.beginTime === null) {
    throw new functions.https.HttpsError('invalid-argument', 'The project must have a begin time.');
  }

  if (data.endTime === null) {
    throw new functions.https.HttpsError('invalid-argument', 'The project must have an end time.');
  }

  const beginTime = new admin.firestore.Timestamp(data.beginTime.seconds, 0);
  const endTime = new admin.firestore.Timestamp(data.endTime.seconds, 0);

  if (beginTime.isEqual(data.endTime) || beginTime.toMillis() > endTime.toMillis()) {
    throw new functions.https.HttpsError('invalid-argument', 
                                         'The end time of the project must be after the begin time.');
  }

  let projectRef = firestore.collection('projects').doc(data.id);

  return projectRef.update({
    name: data.name,
    beginTime: beginTime,
    endTime: endTime,
    description: data.description || null,
    location: data.location || null,
  })
  .then(() => {
    return projectRef.get();
  })
  .then((snapshot) => {
    console.log('Successfully updated project with id: ', projectRef.id);
    return {
      name: snapshot.get('name'),
      beginTime: snapshot.get('beginTime'),
      endTime: snapshot.get('endTime'),
      description: snapshot.get('description'),
      organiserIDs: snapshot.get('organiserIDs'),
      location: snapshot.get('location'),
      code: snapshot.get('code')
    };
  })
  .catch((error) => {
    console.error('Failed to update project, error: ', error);
    throw new functions.https.HttpsError('unknown', error);
  });
});

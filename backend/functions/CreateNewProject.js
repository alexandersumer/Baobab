const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.CreateNewProject = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null || context.auth.token.sign_in_provider === 'anonymous') {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to create an project.');
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

  const project = {
    name: data.name,
    beginTime: beginTime,
    endTime: endTime,
    description: data.description || null,
    location: data.location || null,
    organiserIDs: [context.auth.uid],
    participantIDs: [context.auth.uid],
    moderatorIDs: [context.auth.uid]
  };

  let projectRef;

  return firestore.collection('projects').add(project).then((docRef) => {
    projectRef = docRef;
    project.code = docRef.id.substring(0, 6).toUpperCase();
    return docRef.update({code: project.code});
  })
  .then(() => {
    return firestore.collection('users').doc(context.auth.uid).collection('projects').doc(projectRef.id).set({
      projectRef: firestore.collection('projects').doc(projectRef.id),
      beginTime: beginTime,
      endTime: endTime,
      role: 'organiser'
    });
  })
  .then(() => {
    console.log('Successfully inserted a new project with id: ', projectRef.id);
    return project;
  })
  .catch((error) => {
    console.error('Failed to insert a new project, error: ', error);
    throw new functions.https.HttpsError('unknown', error);
  });
});

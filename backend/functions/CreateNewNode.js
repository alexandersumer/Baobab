const admin = require('firebase-admin');
const wrapper = require('./firebaseWrapper');
const functions = require('firebase-functions');

const auth = wrapper.getAuthInstance();
const firestore = wrapper.getFirestoreInstance();

exports.CreateNewNode = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'An projectID must be provided.')
  }

  if (data.content === null || data.content === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The node must contain content.')
  }

  const time = admin.firestore.FieldValue.serverTimestamp();
  const anon = context.auth.token.sign_in_provider === 'anonymous';

  return auth.getUser(context.auth.uid)
    .then((result) => {
      return firestore.collection('projects').doc(data.projectID).collection('nodes').add({
        projectID: data.projectID,
        postDate: time,
        content: data.content,
        votes: 0,
        upvoteUsers: [],
        downvoteUsers: [],
        posterID: context.auth ? context.auth.uid : 'anon',
        anon: data.anon,
        avatar: (result && !anon && !data.anon) ? result.photoURL || result.providerData[0].photoURL || null : 'anon',
        name: (result && !anon && !data.anon) ? result.displayName || result.providerData[0].displayName : 'Anonymous',
        answered: false
      });
    })
    .then((docRef) => {
      return docRef.get();
    })
    .then((snapshot) => {
      console.log('Successfully inserted a new node');
      return {
        projectID: snapshot.get('projectID'),
        postDate: snapshot.get('postDate'),
        content: snapshot.get('content'),
        votes: snapshot.get('votes'),
        anon: snapshot.get('anon'),
        avatar: snapshot.get('avatar'),
        name: snapshot.get('name'),
        id: snapshot.id
      };
    })
    .catch((error) => {
      console.error('Failed to insert a new node, error: ', error);
      throw new functions.https.HttpsError('unknown', error);
    });
});

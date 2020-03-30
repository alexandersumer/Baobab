const admin = require('firebase-admin');
const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.GetProjectList = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (context.auth === null) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to get your project list');
  }
  let types = [];
  return firestore.collection('users').doc(context.auth.uid)
    .collection('projects').orderBy('beginTime').get()
    .then(snapshot => {
      let promises = [];
      snapshot.forEach(doc => {
        promises.push(doc.data().projectRef.get());
        types.push(doc.data().role);
      });
      return Promise.all(promises);
    })
    .then(values => {
      const now = admin.firestore.Timestamp.now();
      let currentProjects = [];
      let pastProjects = [];
      for (let key in values) {
        let project = values[key].data();
        project.id = values[key].id;
        project.membership = [types[key]];
        project.beginTime._seconds < now._seconds ?
          pastProjects.push(project) : currentProjects.push(project);
      }
      return {pastProjects: pastProjects, currentProjects: currentProjects};
    })
    .catch(error => {
      throw new functions.https.HttpsError('unknown', error);
    });
});

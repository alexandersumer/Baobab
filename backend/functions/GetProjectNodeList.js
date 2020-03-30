const firestore = require('./firebaseWrapper').getFirestoreInstance();
const functions = require('firebase-functions');

exports.GetProjectNodeList = functions.region('asia-northeast1').https.onCall((data, context) => {
  if (data.projectID === null || data.projectID === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The projectID must be non-empty');
  }

  return firestore.collection('projects').doc(data.projectID)
    .collection('nodes').orderBy(data.sortField).get()
    .then(snapshot => {
      let nodes = [];
      let voters = new Set();
      let posters = new Set();
      snapshot.forEach(doc => {
        let node = doc.data();
        node.id = doc.id;
        node.key = doc.id;

        if (node.upvoteUsers.includes(context.auth.uid)) {
          node.userVote = 1; 
        } else if (node.downvoteUsers.includes(context.auth.uid)) {
          node.userVote = -1;
        } else {
          node.userVote = 0;
        }

        node.downvoteUsers.forEach(voters.add, voters);
        node.upvoteUsers.forEach(voters.add, voters);
        posters.add(node.posterID);

        delete node.upvoteUsers;
        delete node.downvoteUsers;

        nodes.push(node);
      });
      return {nodes: nodes, uniqueVoters: voters.size, uniqueNodes: posters.size};
    })
    .catch(error => {
      throw new functions.https.HttpsError('unknown', error);
    });
});

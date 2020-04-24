const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.SearchNodes = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (!context.auth) {
      context.auth = JSON.parse(
        context.rawRequest.headers["x-callable-context-auth"]
      );
    }

    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to get your tree list"
      );
    }

    let nodes = [];
    return firestore
      .collection("users")
      .doc(context.auth.uid)
      .collection("nodes")
      .get()
      .then(snapshot => {
        let promises = [];
        snapshot.forEach(doc => {
          promises.push(doc.data().nodeRef.get());
        });
        return Promise.all(promises);
      })
      .then(values => {
        let partOfNodePromises = [];
        for (let key in values) {
          let node = values[key].data();
          if (node) {
            if (node.parent) {
              partOfNodePromises.push(node.parent.get());
            } else {
              partOfNodePromises.push(Promise.resolve(node));
            }
            node.id = values[key].id;
            nodes.push(node);
          }
        }
        return Promise.all(partOfNodePromises);
      })
      .then(partOfNodes => {
        partOfNodes.forEach((partOf, index) => {
          nodes[index].partOf = partOf.id;
        });
        return;
      })
      .then(() => {
        console.log(nodes);
        return { nodes: nodes };
      })
      .catch(error => {
        console.error(error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

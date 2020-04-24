const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.GetTreeList = functions
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

    let trees = [];
    return firestore
      .collection("users")
      .doc(context.auth.uid)
      .collection("trees")
      .get()
      .then(snapshot => {
        let promises = [];
        snapshot.forEach(doc => {
          promises.push(doc.data().treeRef.get());
        });
        return Promise.all(promises);
      })
      .then(values => {
        let rootNodePromises = [];
        for (let key in values) {
          let tree = values[key].data();
          if (tree) {
            rootNodePromises.push(tree.rootNode.get());
            tree.id = values[key].id;
            trees.push(tree);
          }
        }
        return Promise.all(rootNodePromises);
      })
      .then(rootNodes => {
        rootNodes.forEach((rootNode, index) => {
          trees[index].rootNode = rootNode.id;
        });
        return;
      })
      .then(() => {
        console.log(trees);
        return { trees: trees };
      })
      .catch(error => {
        console.error(error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

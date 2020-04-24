const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.DeleteTree = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }
    if (data.treeID === null || data.treeID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Tree ID must be non-empty"
      );
    }

    const treeRef = firestore.collection("trees").doc(data.treeID);

    return firestore
      .collection("nodes")
      .where("tree", "==", treeRef)
      .get()
      .then(snapshot => {
        if (snapshot) {
          snapshot.forEach(item => {
            item.ref.delete();
          });
        }
        return null;
      })
      .then(() => {
        // eslint-disable-next-line promise/no-nesting
        return firestore
          .collection("kanbanItems")
          .where("tree", "==", treeRef)
          .get()
          .then(snapshot => {
            if (snapshot) {
              snapshot.forEach(item => {
                item.ref.delete();
              });
            }
            return null;
          });
      })
      .then(() => {
        // eslint-disable-next-line promise/no-nesting
        return treeRef.get().then(snapshot => {
          let promises = [];
          if (snapshot.data().owner) {
            promises.push(
              firestore.collection("users").doc(snapshot.data().owner)
            );
          }
          return Promise.all(promises);
        });
      })
      .then(users => {
        for (let key in users) {
          users[key]
            .collection("trees")
            .doc(data.treeID)
            .delete();
        }
        return null;
      })
      .then(() => {
        return treeRef.delete();
      })
      .then(() => {
        return {};
      })
      .catch(error => {
        if (error instanceof functions.https.HttpsError) throw error;
        console.error("Failed to delete tree: ", data.treeID, error);
        throw new functions.https.HttpsError(
          "unknown",
          "An unknown error occurred in deleting the tree.",
          error
        );
      });
  });

const functions = require("firebase-functions");
const firestore = require("../firebaseWrapper").getFirestoreInstance();

exports.UpdateNodePositions = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in daddy."
      );
    }

    if (!data.nodes || data.nodes === null) {
      throw new functions.https.HttpsError("invalid-argument", "Missing nodes");
    }

    data.nodes.forEach((item) => {
      var docRef = firestore.collection("nodes").doc(item.id);
      docRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            return docRef.update({
              x: item.x,
              y: item.y,
            });
          }
          return Promise.resolve();
        })
        .catch((error) => {
          console.error("Couldnt update positions " + error);
        });
    });
    return;
  });

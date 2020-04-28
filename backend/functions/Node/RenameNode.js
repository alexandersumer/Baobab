const functions = require("firebase-functions");
const firestore = require("../firebaseWrapper").getFirestoreInstance();

exports.RenameNode = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.name || data.name === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must have a name"
      );
    }

    if (!data.id || data.id === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must have a ID"
      );
    }

    var docRef = firestore.collection("nodes").doc(data.id);

    // make edits here to the node
    return docRef
      .update({
        name: data.name,
      })
      .then(() => {
        return docRef.get(); // get item from DB
      })
      .then((item) => {
        return {
          id: item.id,
          name: item.get("name"),
        };
      })
      .catch((error) => {
        console.log("Failed to modify a node with error: ", error);
        console.log(error);
        throw error;
      });
  });

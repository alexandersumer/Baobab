const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const firebase = require("firebase-admin");

exports.DeleteConnection = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.parentID) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Parent ID must be non-empty"
      );
    }

    if (!data.childID) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The child ID must be non-empty"
      );
    }

    console.log(data.childID);

    const childDoc = firestore.collection("nodes").doc(data.childID);
    return firestore
      .collection("nodes")
      .doc(data.parentID)
      .update({
        children: firebase.firestore.FieldValue.arrayRemove(childDoc),
      })
      .then(() => {
        childDoc.update({
          parent: null,
        });
        return null;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  });

const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.DeleteKanbanItem = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.itemID || data.itemID === null || data.itemID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Item ID dont exist"
      );
    }

    var toDelete = firestore.collection("kanbanItems").doc(data.itemID);
    return toDelete
      .delete()
      .then(() => {
        console.log("Deletion of " + data.itemID + " was successful");
        return {};
      })
      .catch((error) => {
        throw error;
      });
  });

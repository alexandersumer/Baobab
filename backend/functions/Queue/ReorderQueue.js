const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.ReorderQueue = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.queueID || data.queueID === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Where art the Kanban ID"
      );
    }

    var newOrder;
    if (data.items) {
      newOrder = data.items.map(itemID => {
        return firestore.collection("nodes").doc(itemID);
      });
    } else {
      newOrder = [];
    }

    return firestore
      .collection("nodes")
      .doc(data.queueID)
      .update({
        children: newOrder
      })
      .then(() => {
        console.log("Reorder successful");
        return {};
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  });

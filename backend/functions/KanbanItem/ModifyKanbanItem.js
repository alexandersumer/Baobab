const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.ModifyKanbanItem = functions
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

    if (!data.title || !data.description) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Item title and/ or description missing"
      );
    }

    var docRef = firestore.collection("kanbanItems").doc(data.itemID);

    return docRef
      .update({
        title: data.title,
        description: data.description
      })
      .then(() => {
        return docRef.get();
      })
      .then(item => {
        console.log("Succesfully updated " + item.id);
        return {
          id: item.id,
          title: item.get("title"),
          description: item.get("description")
        };
      })
      .catch(error => {
        console.log("Modification error: ");
        console.error(error);
        throw error;
      });
  });

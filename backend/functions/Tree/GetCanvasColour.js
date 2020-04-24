const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

// INPUT -> treeID NOTE
// possibly not necessary!!
exports.GetCanvasColour = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to view this tree."
      );
    }

    if (data.treeID === null || data.treeID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Tree ID must be non-empty"
      );
    }
    const treeRef = firestore.collection("trees").doc(data.treeID);

    return treeRef
      .get()
      .then(docRef => {
        let docData = docRef.data();
        return docData.canvasColour;
      })
      .catch(error => {
        console.error(error);
      });
  });


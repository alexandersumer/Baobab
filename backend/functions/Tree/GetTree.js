const admin = require("firebase-admin");
const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.GetTree = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (!context.auth) {
      context.auth = JSON.parse(
        context.rawRequest.headers["x-callable-context-auth"]
      );
    }
    if (
      context.auth === null ||
      context.auth.token.sign_in_provider === "anonymous"
    ) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to update an tree."
      );
    }

    if (data.treeID === null || !data.treeID) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Tree ID must be non-empty"
      );
    }

    const treeRef = firestore.collection("trees").doc(data.treeID);

    return treeRef
      .get()
      .then((snapshot) => {
        let tree = snapshot.data();
        tree.treeID = data.treeID;
        return tree;
      })
      .catch((error) => {
        if (error instanceof functions.https.HttpsError) throw error;
        console.error("Failed to get tree: ", data.treeID, error);
        throw new functions.https.HttpsError(
          "unknown",
          "An unknown error occurred in getting tree.",
          error
        );
      });
  });

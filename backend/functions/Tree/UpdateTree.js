const admin = require("firebase-admin");
const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.UpdateTree = functions
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

    if (data.name === null || data.name === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The tree must have a non empty name."
      );
    }

    let treeRef = firestore.collection("trees").doc(data.id);

    return treeRef
      .update({
        name: data.name,
        description: data.description || null
      })
      .then(() => {
        return treeRef.get();
      })
      .then(snapshot => {
        console.log("Successfully updated tree with id: ", treeRef.id);
        return {
          name: snapshot.get("name")
        };
      })
      .catch(error => {
        console.error("Failed to update tree, error: ", error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

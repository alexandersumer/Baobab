const admin = require("firebase-admin");
const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

// Take in treeID, treeName and Colour RENAME AND REPURPOSE!
exports.UpdateColour = functions
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

    if (data.id === null || !data.id) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The tree must have an ID bro."
      );
    }
    
    if (data.canvasColour === null || data.canvasColour === "") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Thre tree must have a valid canvas colour"
        );
    }

    if (data.nodeColour === null || data.nodeColour === "") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Thre tree must have a valid node colour"
        );
    }

    if (data.queueColour === null || data.queueColour === "") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Thre tree must have a valide queue colour"
        );
    }

    //console.log("updateing colours cunt");
    let treeRef = firestore.collection("trees").doc(data.id);

    return treeRef
      .update({
        canvasColour: data.canvasColour,
        nodeColour: data.nodeColour,
        queueColour: data.queueColour,
      })
      .then(() => {
        return treeRef.get();
      })
      .then(snapshot => {
        return {
          name: snapshot.get("name"),
          canvasColour: snapshot.get("canvasColour"),
        };
      })
      .catch(error => {
        console.error("Failed to update canvas colour, error: ", error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

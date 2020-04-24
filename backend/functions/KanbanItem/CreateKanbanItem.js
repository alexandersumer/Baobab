const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.CreateKanbanItem = functions
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
        "You must be signed in to create an tree."
      );
    }

    if (!data.kanbanID || data.kanbanID === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Kanban ID cannot be empty"
      );
    }

    if (!data.title || data.title === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Need to have a title"
      );
    }

    if (!data.tree || data.tree === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Need to have a tree"
      );
    }

    if (!data.id || data.id === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Need to have a ID"
      );
    }

    const kanbanItem = {
      title: data.title,
      description: "",
      parent: firestore.collection("nodes").doc(data.kanbanID),
      tree: firestore.collection("trees").doc(data.tree),
      owner: context.auth.uid
    };

    return firestore
      .collection("kanbanItems")
      .doc(data.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Document already existed in the database"
          );
        } else {
          return firestore
            .collection("kanbanItems")
            .doc(data.id)
            .set(kanbanItem);
        }
      })
      .then(() => {
        return firestore
          .collection("users")
          .doc(context.auth.uid)
          .collection("kanbanItems")
          .doc(data.id)
          .set({
            kanbanItemRef: firestore.collection("kanbanItems").doc(data.id)
          });
      })
      .then(() => {
        return {};
      })
      .catch(error => {
        console.error("Failed to create new node with error: ", error);
        throw error;
      });
  });

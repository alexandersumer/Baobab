const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.CreateQueueItem = functions
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

    if (!data.queueID || data.queueID === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Queue ID cannot be empty"
      );
    }

    if (!data.title || data.title === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Need to have a title"
      );
    }

    if (!data.type || data.type === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Need to have a type"
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

    const queueItem = {
      name: data.title,
      description: "",
      type: data.type,
      parent: firestore.collection("nodes").doc(data.queueID),
      tree: firestore.collection("trees").doc(data.tree),
    };

    if (data.type === constants.NestedTree) {
      queueItem.children = [];
      queueItem.x = 500;
      queueItem.y = 0;
    } else if (data.type === constants.Kanban) {
      queueItem[constants.KanbanTodo] = [];
      queueItem[constants.KanbanDoing] = null;
      queueItem[constants.KanbanDone] = [];
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Type is incorrect"
      );
    }

    return firestore
      .collection("nodes")
      .doc(data.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Document already existed in the database"
          );
        } else {
          return firestore.collection("nodes").doc(data.id).set(queueItem);
        }
      })
      .then(() => {
        return firestore
          .collection("users")
          .doc(context.auth.uid)
          .collection("nodes")
          .doc(data.id)
          .set({
            nodeRef: firestore.collection("nodes").doc(data.id),
          });
      })
      .then(() => {
        return {};
      })
      .catch((error) => {
        console.error("Failed to create new queue item with error: ", error);
        throw error;
      });
  });

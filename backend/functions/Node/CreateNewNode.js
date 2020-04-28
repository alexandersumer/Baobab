const functions = require("firebase-functions");
const firestore = require("../firebaseWrapper").getFirestoreInstance();

exports.CreateNewNode = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (!context.auth) {
      context.auth = JSON.parse(
        context.rawRequest.headers["x-callable-context-auth"]
      );
    }

    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.tree || data.tree === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "A tree must own this node"
      );
    }

    if (!data.partOf || data.partOf === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must be part of some tree"
      );
    }

    if (!data.type || data.type === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must have a type"
      );
    }

    if (!data.name || data.name === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must have a name"
      );
    }

    if (!data.id || data.id === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "This node must have a ID"
      );
    }

    const newNode = {
      children: [],
      name: data.name,
      parent: null,
      tree: firestore.collection("trees").doc(data.tree),
      partOf: firestore.collection("nodes").doc(data.partOf),
      type: data.type,
      owner: context.auth.uid,
      x: data.x ? data.x : 500,
      y: data.y ? data.y : 80,
    };

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
          return firestore.collection("nodes").doc(data.id).set(newNode);
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
        newNode.id = data.id;
        return { newNode };
      })
      .catch((error) => {
        console.error("Failed to create new node with error: ", error);
        throw error;
      });
  });

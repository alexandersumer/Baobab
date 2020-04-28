const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");
const utils = require("../utils");

exports.CreateNewTree = functions
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

    if (data.name === null || data.name === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The tree must have a non empty name."
      );
    }

    const tree = {
      name: data.name,
      description: data.description || null,
      owner: context.auth.uid,
      canvasColour: "#f5f5f5", // default canvas colour
      nodeColour: "#fa7c92",
      queueColour: "#6ec4db",
    };

    const rootNode = {
      name: data.name,
      type: constants.HighLevel,
      children: [],
      parent: null,
      x: 500,
      y: 80,
      treeRoot: true,
    };

    let treeRef;
    let nodeRef;

    return firestore
      .collection("nodes")
      .add(rootNode)
      .then((rootRef) => {
        nodeRef = rootRef;
        tree.rootNode = firestore.collection("nodes").doc(rootRef.id);
        return rootRef;
      })
      .then(() => {
        return firestore.collection("trees").add(tree);
      })
      .then((docRef) => {
        treeRef = docRef;
        return docRef;
      })
      .then(() => {
        return nodeRef.update({
          tree: firestore.collection("trees").doc(treeRef.id),
        });
      })
      .then(() => {
        return firestore
          .collection("users")
          .doc(context.auth.uid)
          .collection("nodes")
          .doc(nodeRef.id)
          .set({
            nodeRef: nodeRef,
          });
      })
      .then(() => {
        return firestore
          .collection("users")
          .doc(context.auth.uid)
          .collection("trees")
          .doc(treeRef.id)
          .set({
            treeRef: firestore.collection("trees").doc(treeRef.id),
          });
      })
      .then(() => {
        console.log("Successfully inserted a new tree with id: ", treeRef.id);
        return tree;
      })
      .catch((error) => {
        console.error("Failed to insert a new tree, error: ", error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

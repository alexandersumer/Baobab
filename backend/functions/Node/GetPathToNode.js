const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.GetPathToNode = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.leafNode || data.leafNode === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Where art the leaft node ID"
      );
    }

    var path = [];
    const getParent = (path, node) => {
      const nodeData = node.data();
      path.push({
        id: node.id,
        title: nodeData.name,
        type: nodeData.type
      });
      // Parentless node -> we are at the top
      if (!node.get("parent")) {
        return node
          .get("tree")
          .get()
          .then(treeDoc => {
            const treeData = treeDoc.data();
            if (treeData && treeDoc.get("name")) {
              path.push({
                treeID: treeDoc.id,
                treeName: treeDoc.get("name")
              });
            }
            return Promise.resolve(path);
          });
        // Get kanban parent
      } else if (
        node.get("type") === constants.Kanban ||
        node.get("type") === constants.NestedTree
      ) {
        return node
          .get("parent")
          .get()
          .then(parentDoc => getParent(path, parentDoc));
        // Queue -> grab who it is part of
      } else if (node.get("type") === constants.Queue) {
        path[path.length - 1].id = node.get("partOf").id;
        return node
          .get("partOf")
          .get()
          .then(rootDoc => getParent(path, rootDoc));
      } else {
        // Should not reach here tbh
        return Promise.resolve(path);
      }
    };

    // Add child to parent
    return firestore
      .collection("nodes")
      .doc(data.leafNode)
      .get()
      .then(leafNodeDoc => {
        return getParent(path, leafNodeDoc);
      })
      .then(path => {
        return { path };
      })
      .catch(error => {
        console.error(error);
        throw error;
      });
  });

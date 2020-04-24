const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.GetTreeNodes = functions
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

    if (data.rootNodeID === null || data.rootNodeID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The treeID must be non-empty"
      );
    }

    const getData = (parent, node, index, root) => {
      // Add node data to its parent
      const nodeData = node.data();

      if ((!nodeData || nodeData === null) && parent === null) {
        throw new functions.https.HttpsError("6969", "404 baby");
      } else if (!nodeData || nodeData === null) {
        console.error("DB error " + node.id + " wasnt found");
        root.treeHasErrors = true;
        return Promise.resolve(root);
      }

      var currentNode = {
        id: node.id,
        type: nodeData.type,
        partOf: nodeData.partOf ? nodeData.partOf.id : null,
        name: nodeData.name,
        children: [],
        tree: nodeData.tree.id,
        parent: nodeData.parent === null ? null : nodeData.parent.id,
        x: nodeData.x ? nodeData.x : 0,
        y: nodeData.y ? nodeData.y : 0
      };

      if (nodeData.type === constants.NestedTree && parent === null) {
        currentNode.type = constants.HighLevel;
      } else if (
        nodeData.type === constants.Kanban ||
        nodeData.type === constants.NestedTree
      ) {
        return Promise.resolve(root);
      }

      // Base Case -> root node
      if (!parent || parent === null) {
        root = currentNode;
      } else {
        parent.children[index] = currentNode;
      }

      if (nodeData.children && nodeData.children.length > 0) {
        childrenPromises = [];
        nodeData.children.forEach((doc, ind) => {
          childrenPromises.push(
            doc.get().then(data => {
              if (data.exists) {
                return getData(currentNode, data, ind, root);
              } else {
                return Promise.resolve(root);
              }
            })
          );
        });
        return Promise.all(childrenPromises).then(() => {
          return root;
        });
      } else {
        return Promise.resolve(root);
      }
    };

    return firestore
      .collection("users")
      .doc(context.auth.uid)
      .collection("nodes")
      .doc(data.rootNodeID)
      .get()
      .then(data => {
        if (!data.exists) {
          throw new Error("444");
        }
        return Promise.resolve();
      })
      .then(() => {
        return firestore
          .collection("nodes")
          .doc(data.rootNodeID)
          .get();
      })
      .then(data => {
        const root = {};
        return getData(null, data, root);
      })
      .then(root => {
        const rootRef = firestore.collection("nodes").doc(data.rootNodeID);
        // eslint-disable-next-line promise/no-nesting
        return firestore
          .collection("nodes")
          .where("partOf", "==", rootRef)
          .where("parent", "==", null)
          .get()
          .then(snapshot => {
            const disconnectedComponentPromises = [];
            if (snapshot) {
              snapshot.forEach(item => {
                disconnectedComponentPromises.push(getData(null, item, {}));
              });
            }
            return Promise.all(disconnectedComponentPromises);
          })
          .then(disconnectedParts => {
            return [root, disconnectedParts];
          });
      })
      .then(results => {
        return results;
      })
      .catch(error => {
        if (error instanceof functions.https.HttpsError) {
          throw error;
        } else if (error.message.indexOf("6969") !== -1) {
          throw new functions.https.HttpsError("unknown", "6969");
        } else if (error.message.indexOf("420") !== -1) {
          throw new functions.https.HttpsError("unknown", "420");
        } else if (error.message.indexOf("444") !== -1) {
          throw new functions.https.HttpsError("unknown", "444");
        } else {
          throw new functions.https.HttpsError("unknown", error);
        }
      });
  });

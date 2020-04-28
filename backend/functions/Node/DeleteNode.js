const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");
const firebase = require("firebase-admin");

exports.DeleteNode = functions
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

    if (data.nodeID === null || data.nodeID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Node ID must be non-empty"
      );
    }

    var treeRef;
    const docRef = firestore.collection("nodes").doc(data.nodeID);
    var docData1;
    var parentDocRef;
    return (
      docRef
        .get()
        .then((docData) => {
          // Remove to delete node from parents
          docData1 = docData;
          treeRef = docData.get("tree");
          if (docData.get("parent")) {
            parentDocRef = docData.get("parent");
            return docData.get("parent").update({
              children: firebase.firestore.FieldValue.arrayRemove(docRef),
            });
          } else if (!docData.get("treeRoot")) {
            parentDocRef = docData.get("partOf");
          }
          return Promise.resolve();
        })
        .then(() => {
          // Recursively delete its children
          if (docData1.get("type") === constants.Kanban) {
            return deleteKanbanNode(docRef);
          } else {
            return deleteTreeNode(docRef);
          }
        })
        // If it was the root tree node then wipe the tree as well
        .then(() => {
          if (parentDocRef) {
            return parentDocRef.get();
          } else {
            // eslint-disable-next-line promise/no-nesting
            return firestore
              .collection("users")
              .doc(context.auth.uid)
              .collection("trees")
              .doc(treeRef.id)
              .delete()
              .then(() => {
                treeRef.delete();
                return null;
              });
          }
        })
        .then(() => {
          if (parentDocRef) {
            return { navigateTo: parentDocRef.id };
          } else {
            return {};
          }
        })
        .catch((error) => {
          console.error(error);
          throw error;
        })
    );
  });

const deleteTreeNode = (docRef) => {
  return docRef
    .get()
    .then((doc) => {
      if (!doc.data()) {
        throw Error("Trying to delete something that doesnt exist");
      }

      const getDeletionData = doc.get("children").map((doc) => doc.get());
      return Promise.all(getDeletionData);
    })
    .then((childrenToRid) => {
      const deletionPromises = childrenToRid.map((doc) => {
        if (doc.get("type") === constants.Kanban) {
          return deleteKanbanNode(doc.ref);
        } else {
          return deleteTreeNode(doc.ref);
        }
      });
      return Promise.all(deletionPromises);
    })
    .then(() => {
      // Wipe all disconnected components that are part of this one as well
      // eslint-disable-next-line promise/no-nesting
      return firestore
        .collection("nodes")
        .where("partOf", "==", docRef)
        .get()
        .then((snapshot) => {
          return snapshot.forEach((item) => {
            if (item.get("type") === constants.Kanban) {
              return deleteKanbanNode(item.ref);
            } else {
              return deleteTreeNode(item.ref);
            }
          });
        })
        .then(() => {
          return docRef.delete();
        });
    })
    .catch((error) => {
      throw error;
    });
};

const deleteKanbanNode = (docRef) => {
  return docRef
    .get()
    .then((doc) => {
      if (doc.get("type") !== constants.Kanban) {
        throw Error("Trying to delete a non kanban type");
      } else if (!doc.data()) {
        throw Error("Trying to delete something that doesnt exist");
      }
      const deletionPromises = [];

      if (
        doc.get(constants.KanbanDoing) &&
        doc.get(constants.KanbanDoing) !== null
      ) {
        deletionPromises.push(doc.get(constants.KanbanDoing).delete());
      }

      doc.get(constants.KanbanTodo).forEach((kanbanRef) => {
        deletionPromises.push(kanbanRef.delete());
      });

      doc.get(constants.KanbanDone).forEach((kanbanRef) => {
        deletionPromises.push(kanbanRef.delete());
      });

      return Promise.all(deletionPromises);
    })
    .then(() => {
      return docRef.delete();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

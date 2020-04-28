const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const firebase = require("firebase-admin");

exports.AddConnection = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.parent || data.parent === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Where art the parent ID"
      );
    }

    if (!data.child || data.child === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Where art the child ID"
      );
    }

    const parent = firestore.collection("nodes").doc(data.parent);
    const child = firestore.collection("nodes").doc(data.child);
    const tmp = [parent.get(), child.get()];
    // Add child to parent
    return Promise.all(tmp)
      .then((a) => {
        a.forEach((item) => {
          if (!item.exists) {
            throw Error("Items doesn't exist");
          }
        });
        return Promise.resolve();
      })
      .then(() => {
        return firestore
          .collection("nodes")
          .doc(data.parent)
          .update({
            children: firebase.firestore.FieldValue.arrayUnion(child),
          });
      })
      .then(() => {
        return child.get();
      })
      .then((childsnapshot) => {
        const oldParent = childsnapshot.get("parent");
        if (oldParent) {
          return oldParent.update({
            children: firebase.firestore.FieldValue.arrayRemove(child),
          });
        } else {
          return null;
        }
      })
      .then(() => {
        child.update({
          parent: parent,
        });
        return null;
      })
      .then(() => {
        return {};
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  });

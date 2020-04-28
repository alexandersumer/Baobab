const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.GetQueueItems = functions
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

    if (!data.queueHeadID || data.queueHeadID === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Kanban ID cannot be empty"
      );
    }

    return firestore
      .collection("nodes")
      .doc(data.queueHeadID)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        var childrenPromises;

        if (data.children) {
          childrenPromises = data.children.map((item) => item.get());
        } else {
          childrenPromises = [];
        }
        return Promise.all(childrenPromises);
      })
      .then((childrenSnapshot) => {
        if (childrenSnapshot.length > 0) {
          const result = childrenSnapshot.map((child) => {
            const data = child.data();
            return {
              title: data.name,
              type: data.type,
              id: child.id,
            };
          });
          return { QueueItems: result };
        } else {
          return { QueueItems: [] };
        }
      })
      .catch((error) => {
        console.error("Failed to get queue nodes with error: ", error);
        throw error;
      });
  });

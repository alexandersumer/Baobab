const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.SearchKanbanItems = functions
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
        "You must be signed in to get your tree list"
      );
    }

    let kanbanItems = [];
    let parentToChildren = {};
    return firestore
      .collection("users")
      .doc(context.auth.uid)
      .collection("kanbanItems")
      .get()
      .then((snapshot) => {
        let promises = [];
        snapshot.forEach((doc) => {
          promises.push(doc.data().kanbanItemRef.get());
        });
        return Promise.all(promises);
      })
      .then((values) => {
        let parentNodePromises = [];
        for (let key in values) {
          let kanbanItem = values[key].data();
          if (kanbanItem) {
            parentNodePromises.push(kanbanItem.parent.get());
            kanbanItem.id = values[key].id;
            kanbanItems.push(kanbanItem);
          }
        }
        return Promise.all(parentNodePromises);
      })
      .then((parentNodes) => {
        parentNodes.forEach((parent, index) => {
          if (!parentToChildren[parent.id]) {
            parentToChildren[parent.id] = {
              [constants.KanbanDoing]: parent.get(constants.KanbanDoing)
                ? parent.get(constants.KanbanDoing).id
                : null,
              [constants.KanbanDone]: parent
                .get(constants.KanbanDone)
                .map((item) => item.id),
              [constants.KanbanTodo]: parent
                .get(constants.KanbanTodo)
                .map((item) => item.id),
            };
          }
          kanbanItems[index].parent = parent.id;
        });
        return;
      })
      .then(() => {
        return { kanbanItems: kanbanItems, parentChildren: parentToChildren };
      })
      .catch((error) => {
        console.error(error);
        throw new functions.https.HttpsError("unknown", error);
      });
  });

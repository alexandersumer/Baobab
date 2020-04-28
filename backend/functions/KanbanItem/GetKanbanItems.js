const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.GetKanbanItems = functions
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
    if (!data.kanbanID || data.kanbanID === null || data.kanbanID === "") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The Kanban ID must be non-empty"
      );
    }

    var kanbanData;
    return firestore
      .collection("users")
      .doc(context.auth.uid)
      .collection("nodes")
      .doc(data.kanbanID)
      .get()
      .then((data) => {
        if (!data.exists) {
          throw new Error("444", "403 baby");
        }
        return Promise.resolve();
      })
      .then(() => {
        return firestore.collection("nodes").doc(data.kanbanID).get();
      })
      .then((docRef) => {
        kanbanData = docRef.data();

        if (!kanbanData) {
          throw new Error("6969");
        } else if (kanbanData.type !== constants.Kanban) {
          console.log("Tried to load a non kanban type");
          throw new Error("420");
        }

        const itemPromises = [];
        const kanbanColumns = [
          kanbanData.ToDo,
          kanbanData.Doing,
          kanbanData.Done,
        ];

        kanbanColumns.forEach((item, index) => {
          const childPromises = [];
          if (item && index !== 1) {
            item.forEach((docRef) => {
              childPromises.push(docRef.get());
            });
          } else if (item && index === 1) {
            childPromises.push(item.get());
          }

          itemPromises.push(Promise.all(childPromises));
        });

        return Promise.all(itemPromises);
      })
      .then((resolvedPromises) => {
        const convertToForm = (snapshot) => {
          const result = [];
          snapshot.forEach((item) => {
            const itemData = item.data();
            result.push({
              id: item.id,
              title: itemData.title,
              description: itemData.description,
            });
          });
          return result;
        };

        var kanbanResult = {
          [constants.KanbanTodo]: convertToForm(resolvedPromises[0]),
          [constants.KanbanDoing]: convertToForm(resolvedPromises[1]),
          [constants.KanbanDone]: convertToForm(resolvedPromises[2]),
        };
        return [kanbanResult, kanbanData.tree.id, kanbanData.name];
      })
      .catch((error) => {
        console.log("Caught error");
        console.error(error);
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

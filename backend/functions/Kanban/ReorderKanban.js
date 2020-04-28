const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");
const constants = require("../Constants");

exports.ReorderKanban = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (context.auth === null) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    if (!data.kanbanID || data.kanbanID === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Where art the Kanban ID"
      );
    }

    const newToDo = [];
    const newDone = [];
    var newDoing;

    if (data.doing) {
      newDoing = firestore.collection("kanbanItems").doc(data.doing);
    } else {
      console.log("Nothing in doing, treating as empty");
      newDoing = null;
    }

    const lanes = [
      { list: "ToDo", newArr: newToDo, data: data.toDo },
      { list: "Doing", newArr: newDone, data: data.done },
    ];
    for (index in lanes) {
      const item = lanes[index];
      if (item.data) {
        item.data.forEach((refID) => {
          item.newArr.push(firestore.collection("kanbanItems").doc(refID));
        });
      } else {
        console.log("Nothing in " + item.list + " treating as empty");
      }
    }

    return firestore
      .collection("nodes")
      .doc(data.kanbanID)
      .update({
        ToDo: newToDo,
        Doing: newDoing,
        Done: newDone,
      })
      .then(() => {
        console.log("Reorder successful");
        return firestore.collection("nodes").doc(data.kanbanID).get();
      })
      .then((snapshot) => {
        return {
          ToDo: snapshot.data().ToDo.map((item) => item.id),
          Doing: snapshot.data().Doing ? snapshot.data().Doing.id : null,
          Done: snapshot.data().Done.map((item) => item.id),
        };
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  });

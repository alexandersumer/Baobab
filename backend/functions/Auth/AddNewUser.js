const firestore = require("../firebaseWrapper").getFirestoreInstance();
const functions = require("firebase-functions");

exports.AddNewUser = functions
  .region("asia-northeast1")
  .auth.user()
  .onCreate(async (user) => {
    const { uid, displayName, email } = user;

    return await firestore
      .collection("users")
      .doc(uid)
      .set({ uid, displayName, email })
      .then(() => {
        return console.log("New user inserted into database with ID: ", uid);
      })
      .catch((error) => {
        return console.error(
          "Failed to insert user with uid: ",
          uid,
          ", error: ",
          error
        );
      });
  });

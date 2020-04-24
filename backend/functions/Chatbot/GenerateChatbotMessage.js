const functions = require("firebase-functions");
const serviceAccount = require("./service-account.json");

const dialogflow = require("dialogflow");

exports.GenerateChatbotMessage = functions
  .region("asia-northeast1")
  .https.onCall((data, context) => {
    if (!context.auth) {
      context.auth = JSON.parse(
        context.rawRequest.headers["x-callable-context-auth"]
      );
    }

    if (context.auth.uid === null) {
      return "Please sign in to use Baobot!";
    }

    const sessionId = context.auth.uid;
    const queryInput = {
      text: {
        text: data.input,
        languageCode: "en-US"
      }
    };

    const sessionClient = new dialogflow.v2.SessionsClient({
      credentials: serviceAccount
    });
    const session = sessionClient.sessionPath("baobab-82803", sessionId);

    const prom = new Promise(async (resolve, reject) => {
      try {
        responses = await sessionClient.detectIntent({ session, queryInput });
        const result = responses[0].queryResult;
        resolve(result.fulfillmentText);
      } catch (err) {
        reject(err);
      }
    });

    return prom;
  });

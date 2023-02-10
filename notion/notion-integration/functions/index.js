const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Client } = require("@notionhq/client");

admin.initializeApp();
const config = functions.config();
const notion = new Client({ auth: config.env.notion.key });

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.queryDatabase = functions.https.onRequest(async (req, res) => {
  try {
    const database = await notion.databases.retrieve({
      database_id: config.env.notion.database_id,
    });
    res.status(200).json(database);
  } catch (error) {
    console.error(error);
    res.status(400).json({});
  }
});

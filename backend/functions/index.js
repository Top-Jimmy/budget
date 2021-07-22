const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
// const Busboy = require("busboy");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    functions.logger.info("Hello logs!", {structuredData: true});
    res.send("Budgeting is great!");
  });
});

exports.csvTransferUpload = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    functions.logger.log("csvTransferUpload");
    // const busboy = new Busboy({headers: req.headers});
    // functions.logger.log("created Busboy");
    // const fields = {};

    // busboy.on("field", (fieldname, val) => {
    //   functions.logger.log(fieldname, ": ", val);
    // });
    const transfers = req.body.transfers;
    functions.logger.log(transfers);
    if (transfers && transfers) {
      transfers.forEach((t, i) => {
        admin.firestore().collection("transfers").add({t});
      });
    }

    res.send({result: "success"});
  });
});

// exports.addMessage = functions.https.onRequest((req, res) => {
//     const original = req.query.text;

//     const writeResult = admin.firestore()
//         .collection('messages').add({original: original});
//     res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

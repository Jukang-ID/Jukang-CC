// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./capstone-project-5d14f-firebase-adminsdk-ewvx4-fde5a50669.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
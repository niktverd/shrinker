require('dotenv').config();

const {initializeApp} = require('firebase/app');
const {getFirestore} = require('firebase/firestore/lite');
// const {getStorage} = require('firebase/storage');

const firebaseConfigData = process.env.FIREBASE_CONFIG;

const firebaseConfig = JSON.parse(firebaseConfigData || '{}');

const firebaseApp = initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);

module.exports = {
    firestore,
};

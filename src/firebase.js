import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDfaqzncFC6GW8NZMJ0WVyb2SI6FCRdCy8",
  authDomain: "instagram-clone-95dc2.firebaseapp.com",
  databaseURL: "https://instagram-clone-95dc2.firebaseio.com",
  projectId: "instagram-clone-95dc2",
  storageBucket: "instagram-clone-95dc2.appspot.com",
  messagingSenderId: "504276109312",
  appId: "1:504276109312:web:437e6dc1da2f27f97670e5",
  measurementId: "G-HG7B80GMR8",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };

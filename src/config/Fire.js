import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBx3oyV5-IZt1qf2OQxuygzMTiDbxYltZk",

  authDomain: "expense-tracker-81120.firebaseapp.com",

  databaseURL: "https://expense-tracker-81120-default-rtdb.firebaseio.com",

  projectId: "expense-tracker-81120",

  storageBucket: "expense-tracker-81120.appspot.com",

  messagingSenderId: "889106721903",

  appId: "1:889106721903:web:fa19babd05a7c4dc4db19a",

  measurementId: "G-19942RCK13"


};

const fire = firebase.initializeApp(firebaseConfig);
export default fire;

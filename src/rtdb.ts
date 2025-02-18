import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "NoWM6vxxcgRHdI0TV8Agwa9m7NHVJv7KBTWQl4wP",
  databaseURL: "https://jeremias-prueba-default-rtdb.firebaseio.com/",
  authDomain: "jeremias-prueba.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };

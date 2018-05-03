import firebase from 'firebase'
import firebaseui from "firebaseui";

var config = {
    apiKey: "AIzaSyBof6BZd5Ul_i3GXovYZi7vZBQ9aZe7PqU",
    authDomain: "shopping-list-da394.firebaseapp.com",
    databaseURL: "https://shopping-list-da394.firebaseio.com",
    projectId: "shopping-list-da394",
    storageBucket: "shopping-list-da394.appspot.com",
    messagingSenderId: "381612330740"
};

var fire = firebase.initializeApp(config);


export default fire;


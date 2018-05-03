
var config = {
    apiKey: "AIzaSyBof6BZd5Ul_i3GXovYZi7vZBQ9aZe7PqU",
    authDomain: "shopping-list-da394.firebaseapp.com",
    databaseURL: "https://shopping-list-da394.firebaseio.com",
    projectId: "shopping-list-da394",
    storageBucket: "shopping-list-da394.appspot.com",
    messagingSenderId: "381612330740"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        document.getElementById("login_div").style.display = "none";
        document.getElementById("message_div").style.display = "block";

        if(user != null) {
            var email = user.email;
            document.getElementById("message").innerHTML = email;
        }
    } else {
        document.getElementById("login_div").style.display = "block";
        document.getElementById("message_div").style.display = "none";

    }
});

function login() {
    var userEmail = document.getElementById("input_email").value;
    var userPass = document.getElementById("input_pass").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(err) {
       alert("Unable to login: " + err.message);
    });

}

function logout() {
    firebase.auth().signOut();
}

function googleLogin() {
    const provider = new firebase.auth().GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider);
}

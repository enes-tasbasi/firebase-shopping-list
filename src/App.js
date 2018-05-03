import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
//import fire from './fire';
import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBof6BZd5Ul_i3GXovYZi7vZBQ9aZe7PqU",
    authDomain: "shopping-list-da394.firebaseapp.com",
    databaseURL: "https://shopping-list-da394.firebaseio.com",
    projectId: "shopping-list-da394",
    storageBucket: "shopping-list-da394.appspot.com",
    messagingSenderId: "381612330740"
};

var fire = firebase.initializeApp(config);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            listItems: {},
            current: "",
            loggedIn: false,
            user: {}
        };


        this.handleChange = this.handleChange.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getListFromDatabase = this.getListFromDatabase.bind(this);
        this.add = this.add.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.renderLoginMessage = this.renderLoginMessage.bind(this);
    }

    getListFromDatabase(event) {
        event.preventDefault();

        let messagesRef = fire.database().ref('message');
        messagesRef.on('child_added', snapshot => {
            /* Update React state when message is added at Firebase Database */
            //let message = { text: snapshot.val(), id: snapshot.key };
            var tempList = this.state.items.concat([snapshot.val()]);
            this.setState({items: tempList});
        });
    }

    handleChange(event) {
        this.setState({current: event.target.value});
    }

    componentWillMount() {


        let messagesRef = fire.database().ref('message').orderByKey().limitToLast(100);
        var tempArr = this.state.items;

        var itemMap = new Map();
        messagesRef.on('child_added', snapshot => {

            itemMap.set(snapshot.key, snapshot.val());

            //console.log(itemMap);

            var tempItem = this.state.items.concat([snapshot.val()]);
            tempItem.reverse();
            this.setState({items: tempItem, listItems: itemMap});

        });


    }

    add(event) {
        event.preventDefault();

        let messagesRef = fire.database().ref('message');

        var arrayvar = this.state.items.slice();
        if (this.state.current != "") {
            arrayvar.push(this.state.current);
            this.setState({items: arrayvar});

            messagesRef.push(this.state.current);


            this.refs.input.value = '';
            this.setState({current: ""});
        }

    }

    remove(i, event) {
        event.preventDefault();

        let messageRef = fire.database().ref('message');

        var arrayVar = this.state.items.slice();

        var tempMap = this.state.listItems;
        console.log(tempMap);

        tempMap.forEach(function (value, key) {
            if (arrayVar[i] === value) {
                messageRef.child(key).remove();
            }
        });
        arrayVar.splice(i, 1);
        this.setState({items: arrayVar});
    }

    login() {

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((result) => {
            var user = result.user;
            this.setState({loggedIn: true, user: user});
        }, (error) => {
            alert("Error logging in: " + error.message);
        });
    }

    logout() {
        firebase.auth().signOut();
        this.setState({loggedIn: false, user: {}});
    }


    renderLoginMessage() {
        if(this.state.loggedIn === false) {
            return  <button onClick={this.login} className="login-button">Log In</button>;
        } else {
            return (
                <div className="login-message">
                    <h3>Logged in as: {this.state.user.displayName}</h3>
                    <button onClick={this.logout} className="login-button">Log out</button>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderLoginMessage()}
                <div className="container">
                    <form>
                        <span>New item: </span>
                        <input
                            ref="input"
                            id="input"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <button type="submit" onClick={this.add}>
                            Submit
                        </button>
                    </form>
                    <div>
                        <ul>
                            {this.state.items.map((item, i) => (
                                <li key={i}>
                                    {item}
                                    <button
                                        onClick={this.remove.bind(this, i)}
                                        key={i}
                                        className="fa fa-window-close"
                                        aria-hidden="true"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}


export default App;

import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './App.css';
import firebase from 'firebase';
import config from './fireConfig';



var fire = firebase.initializeApp(config);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            listItems: {},
            current: "",
            loggedIn: false,
            user: {},
            databaseRef: "message"
        };


        this.handleChange = this.handleChange.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getListFromDatabase = this.getListFromDatabase.bind(this);
        this.add = this.add.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.renderLoginMessage = this.renderLoginMessage.bind(this);
    }

    getListFromDatabase() {

        let messagesRef = fire.database().ref(this.state.databaseRef);
        messagesRef.on('child_added', snapshot => {
            /* Update React state when message is added at Firebase Database */
            //let message = { text: snapshot.val(), id: snapshot.key };

            var itemMap = new Map();
            itemMap.set(snapshot.key, snapshot.val());

            var tempList = this.state.items.concat([snapshot.val()]);

            tempList.reverse();
            this.setState({items: tempList, listItems: itemMap});
        });

    }

    handleChange(event) {
        this.setState({current: event.target.value});
    }

    componentWillMount() {

        let messagesRef = fire.database().ref(this.state.databaseRef);

        var itemMap = new Map();
        messagesRef.on('child_added', snapshot => {

            itemMap.set(snapshot.key, snapshot.val());

            var tempItem = this.state.items.concat([snapshot.val()]);
            tempItem.reverse();
            this.setState({items: tempItem, listItems: itemMap});

        });
    }

    add(event) {
        event.preventDefault();

        let messagesRef = fire.database().ref(this.state.databaseRef);

        let arrayvar = this.state.items.slice();
        if (this.state.current !== "") {
            arrayvar.push(this.state.current);
            this.setState({items: arrayvar});

            messagesRef.push(this.state.current).then((result) => {
                //    console.log(result)
            }, (err) => {
                //   console.log(err)
            });


            this.refs.input.value = '';
            this.setState({current: ""});
        }

    }

    remove(i, event) {
        event.preventDefault();


        let messageRef = fire.database().ref(this.state.databaseRef);

        var arrayVar = this.state.items.slice();

        var tempMap = this.state.listItems;


        tempMap.forEach(function (value, key) {
            if (arrayVar[i] === value) {
                messageRef.child(key).remove();
                tempMap.delete(value);
            }
        });

        console.log(tempMap);
        arrayVar.splice(i, 1);
        this.setState({items: arrayVar});
    }

    login() {

        let provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((result) => {
            let user = result.user;
            console.log(user);

            this.setState({loggedIn: true, user: user, items: [], listItems: { }, databaseRef: "users/" + user.uid + "/message"});
            this.componentWillMount();
        }, (error) => {
            alert("Error logging in: " + error.message);
        });
    }

    logout() {
        firebase.auth().signOut();
        this.setState({loggedIn: false, user: {}, items: [], listItems: {}, databaseRef: "message"});
        this.componentWillMount();
    }


    renderLoginMessage() {
        if (this.state.loggedIn === false) {
            return <button onClick={this.login} className="login-button">Log In</button>;
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
        const transitionOptions = {
            transitionName: 'fade',
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 500
        };

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
                            <ReactCSSTransitionGroup {...transitionOptions}>
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
                            </ReactCSSTransitionGroup>
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}


export default App;

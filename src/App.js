import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fire from './fire';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      listItems: {},
      current: ""
    };



    this.handleChange = this.handleChange.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.getListFromDatabase = this.getListFromDatabase.bind(this);
    this.add = this.add.bind(this);
  }

  getListFromDatabase(event) {
    event.preventDefault();

    let messagesRef = fire.database().ref('message');
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      //let message = { text: snapshot.val(), id: snapshot.key };
      var tempList = this.state.items.concat([snapshot.val()]);
      this.setState({ items: tempList });
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

        console.log(itemMap);

        var tempItem = this.state.items.concat([ snapshot.val() ]);
        tempItem.reverse();
        this.setState({ items: tempItem, listItems: itemMap });

      });
    }

    add(event) {
      event.preventDefault();

      let messagesRef = fire.database().ref('message');

      var arrayvar = this.state.items.slice();
      if(this.state.current != "") {
        arrayvar.push(this.state.current);
        this.setState({items: arrayvar});

        messagesRef.push(this.state.current);


        this.refs.input.value = '';
        this.setState({ current: ""});
      }

    }

    remove(i, event) {
      event.preventDefault();

      let messageRef = fire.database().ref('message');

      var arrayVar = this.state.items.slice();

      var tempMap = this.state.listItems;
      console.log(tempMap);

      tempMap.forEach(function(value, key) {
          if(arrayVar[i] === value) {
            messageRef.child(key).remove();
          }
      });

      arrayVar.splice(i, 1);


      this.setState({ items: arrayVar });


    }

  render() {
    return (

      <div>
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
              <li>
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
    );
  }
}

export default App;

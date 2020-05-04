import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';


class App extends Component {
  // LOCAL STATE
  state = {
    values: []
  };
  // LIFECYCLE
  componentDidMount() {
    // rerender and update state
    // THIS IS WHERE YOU WOULD GET DATA FROM AN API
    // AXIOS(is a promise-based method)
    axios.get('http://localhost:5000/api/values').then((response) => {
      console.log(response);
      this.setState({
        values: response.data
      });
    });
  }
  render() {
    // RENDER
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" className="App-logo"/>
          <ul>
            {/* using 'any is just like using regular js' */}
            {this.state.values.map((value: any) => (
              <li key={value.id}>{value.name}</li>
            ))}
          </ul>
        </header>
      </div>
    );
  };
};

export default App;

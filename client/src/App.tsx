import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Header, Icon, List } from 'semantic-ui-react';

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
      this.setState({
        values: response.data
      });
    });
  }
  render() {
    // RENDER
    return (
      <>
        <Header as='h2'>
          <Icon name='plug' />
          <Header.Content>Uptime Guarantee</Header.Content>
        </Header>
        <List>
            {/* using 'any is just like using regular js' */}
            {this.state.values.map((value: any) => (
              <List.Item key={value.id}>{value.name}</List.Item>
            ))}
        </List>
      </>
    );
  };
};

export default App;

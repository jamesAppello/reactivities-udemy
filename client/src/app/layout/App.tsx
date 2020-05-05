import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';

import axios from 'axios';
import { IActivity } from '../models/activity';

interface IState {
  // define what is in our state
  activities: IActivity[] // <-- this way declares activities to be an array of activities extending the interface we made in models/
}


class App extends Component<{}, IState> {
  // LOCAL STATE
  readonly state: IState = {
    activities: [] // only way we should update is with this.setState method(-r:'prop')
  };
  // LIFECYCLE
  componentDidMount() {
    // rerender and update state
    // THIS IS WHERE YOU WOULD GET DATA FROM AN API
    // AXIOS(is a promise-based method)
    axios.get<IActivity[]>('http://localhost:5000/api/activities').then((response) => {
      this.setState({
        activities: response.data
      });
    });
  }
  render() {
    // RENDER
    return (
      <>
        <Header as='h2'>
          <Icon name='arrow circle up' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
            {/* using 'any is just like using regular js' */}
            {this.state.activities.map((activity) => (
              <List.Item key={activity.id}>{activity.title}</List.Item>
            ))}
        </List>
      </>
    );
  };
};

export default App;

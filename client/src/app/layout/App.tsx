import React, { Component, useState, useEffect } from 'react';
import { Header, Icon, List, Container } from 'semantic-ui-react';

import axios from 'axios';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';


interface IState {
  // define what is in our state
  activities: IActivity[] // <-- this way declares activities to be an array of activities extending the interface we made in models/
}


const App = () => {
  // LOCAL STATE
  // useState_hook
  const [activities, setActivities] = useState<IActivity[]>([]); // default type: naver
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null); // leaving blank -> the type will be IActivity or undefined
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string)=> {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  // LIFECYCLE
  // useEffect_hook
  useEffect(() => { // like having componentDidMount, componentDidUpdate, componentWillUnmount all in one!
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((res) => {
        setActivities(res.data);
      });
  }, []); // if you want it to run asynchronously('only once':<< when_called) then insert an empty array a an extra parameter after the cb
  
    // RENDER
    return (
      <>
        <NavBar openCreateForm={handleOpenCreateForm} />
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity} 
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode} 
            setSelectedActivity={setSelectedActivity}
            />
        </Container>
      </>
    );
};

export default App;

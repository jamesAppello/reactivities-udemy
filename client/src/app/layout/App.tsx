import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';

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
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const forgeNewActivity = (activity: IActivity) => {
    // use existing activities, and use comma to add NEW activity to the activities array
    setActivities([ ...activities, activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };
  const handleTheChangeUp = (activity: IActivity) => {
    // filer thru the existing activities to find where the ids are NOT equal
    // comma then pass in new activity (editied!)
    setActivities([ ...activities.filter(a => a.id !== activity.id), activity ]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  // LIFECYCLE
  // useEffect_hook
  useEffect(() => { // like having componentDidMount, componentDidUpdate, componentWillUnmount all in one!
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then((res) => {
        let activities: IActivity[] = []; // b4 we set activities we will loop thru resp.data
        res.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
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
            createActivity={forgeNewActivity}
            editActivity={handleTheChangeUp}
            deleteActivity={handleDeleteActivity}
            />
        </Container>
      </>
    );
};

export default App;

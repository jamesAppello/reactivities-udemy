import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import Loading from './Loading';


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
  // for the loader component
  const [loading, setLoading] = useState(true);
  // while submit is taking place
  const [submitting, setSubmitting] = useState(false);
  // setting the target activity being handled
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string)=> {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const forgeNewActivity = (activity: IActivity) => {
    setSubmitting(true);
    // API call to our database
    agent.Activities.create(activity).then(() => {
      // use existing activities, and use comma to add NEW activity to the activities array
      setActivities([ ...activities, activity ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };
  const handleTheChangeUp = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      // filer thru the existing activities to find where the ids are NOT equal
      // comma then pass in new activity (editied!)
      setActivities([ ...activities.filter(a => a.id !== activity.id), activity ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
      // this removes the deleted activity from 'view'
      setSelectedActivity(null);
    }).then(() => setSubmitting(false));
  }

  // LIFECYCLE
  // useEffect_hook
  useEffect(() => { // like having componentDidMount, componentDidUpdate, componentWillUnmount all in one!
    agent
    .Activities
    .list()  
      .then((res) => {
        let activities: IActivity[] = []; // b4 we set activities we will loop thru resp.data
        res.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      }).then(() => setLoading(false));
  }, []); // if you want it to run asynchronously('only once':<< when_called) then insert an empty array a an extra parameter after the cb
  

  if (loading) return <Loading content='loading your shit....' />

    // RENDER
    return (
      <>
        <NavBar openCreateForm={handleOpenCreateForm} />
        <Container style={{marginTop: '7em'}}>
          {/* dashboard acts as a 'middleman' for passing state via props */}
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
            submitting={submitting}
            target={target}
            />
        </Container>
      </>
    );
};

export default App;

import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IState {
  // define what is in our state
  activities: IActivity[] // <-- this way declares activities to be an array of activities extending the interface we made in models/
}


const App = () => {
  // define our CONTEXT
  const activityStore = useContext(ActivityStore);


  // LIFECYCLE
  // useEffect_hook
  useEffect(() => { // like having componentDidMount, componentDidUpdate, componentWillUnmount all in one!
    // bc we are using a method inside out useEffect
    // have to tell the dependency array what it needs to run this function
    activityStore.loadActivArr()
  }, [activityStore]); // if you want it to run asynchronously('only once':<< when_called) then insert an empty array a an extra parameter after the cb
  

  if (activityStore.loadingInit) return <Loading content='loading your shit....' />

    // RENDER
    return (
      <>
        <NavBar />
        <Container style={{marginTop: '7em'}}>
          
          {/* dashboard acts as a 'middleman' for passing state via props */}
          <ActivityDashboard />
        </Container>
      </>
    );
};

export default observer(App);

import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import Loading from '../../../app/layout/Loading';

const ActivityDashboard: React.FC = () => {
      // define our CONTEXT
  const activityStore = useContext(ActivityStore);

  // LIFECYCLE
  // useEffect_hook
  useEffect(() => { // like having componentDidMount, componentDidUpdate, componentWillUnmount all in one!
    // bc we are using a method inside out useEffect
    // have to tell the dependency array what it needs to run this function
    activityStore.loadActivArr()
  }, [activityStore]); // if you want it to run asynchronously('only once':<< when_called) then insert an empty array a an extra parameter after the cb
  

  if (activityStore.loadingInit) return <Loading content='loading your shit....' />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity Filters</h2>
            </Grid.Column>
        </Grid>
    )
}
export default observer(ActivityDashboard);
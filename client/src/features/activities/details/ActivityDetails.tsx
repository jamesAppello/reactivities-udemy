import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface DetailParams {
    id: string;
};

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ match }) => {
    
    const activityStore = useContext(ActivityStore);
    const { 
        activity,
        loadActivity,
        loadingInit
    } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]); // *!* remember to add dependencies *!*

    // return <h1>Activity Details</h1>
    if (loadingInit) // removed " || !activity " *** 
        return <Loading content='Loading...' />;

    // for if in the event the url attempts to load an activity that does not exist
    if (!activity) {
        return <h2>Activity Not Found | <strong>NET_ERR::404</strong></h2>
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
}
export default observer(ActivityDetails);
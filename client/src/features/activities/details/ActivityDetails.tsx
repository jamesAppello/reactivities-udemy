import React, { useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import Loading from '../../../app/layout/Loading';

interface DetailParams {
    id: string;
};

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({ 
    match,
    history 
}) => {
    
    const activityStore = useContext(ActivityStore);
    const { 
        activity,
        loadActivity,
        loadingInit
    } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id])

    // return <h1>Activity Details</h1>
    if (loadingInit || !activity) return <Loading content='Loading...' />;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
            <Card.Header>{activity!.title}</Card.Header>
            <Card.Meta>
                <span className='date'>{activity!.date}</span>
            </Card.Meta>
            <Card.Description>{activity!.description}</Card.Description>
            </Card.Content>
        <Card.Content extra>
            <Button.Group widths={2}>
                <Button 
                    as={Link}
                    to={`/manage/${activity.id}`}
                    basic 
                    color='blue' 
                    content='Edit' 
                />
                <Button 
                    onClick={() => history.push('/activities')} // ** we need to be able to cancel this event...aswell as for the open edit method
                    basic 
                    color='grey' 
                    content='Cancel' 
                />
                
            </Button.Group>
        </Card.Content>
        </Card>
    )
}
export default observer(ActivityDetails);
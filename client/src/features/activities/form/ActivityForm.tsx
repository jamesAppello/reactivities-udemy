import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';


interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { 
        createActivity, 
        editActivity, 
        submitting, 
        activity: initiaFormState,
        loadActivity,
        clearActivity 
    } = activityStore;


    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        // we want to load an activity
        // only when we are editing is when we want to show the activity
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id)
                .then(() => {
                    //only executed if we have activity in initial form state
                   initiaFormState && setActivity(initiaFormState)
                });
        };
        // we can do 'cleanup' inside useEffect(bc its like all 3 LC methods in one!)
        return () => { // UNSUBSCRIBE-METHOD-->'unmounting component'
            // we want to call a function thats going to clear activity from activity store
            clearActivity();
        };
    }, [
        loadActivity,
        match.params.id,
        clearActivity,
        initiaFormState,
        activity.id.length
    ]);

    const handleSubaDubDub = () => {
        // determine whether or not you are creating or editing
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity)
                .then(() => {
                    // redirect user to /activities
                    history.push(`/activities/${newActivity.id}`)
                });
        } else {
            editActivity(activity)
                .then(() => {
                    history.push(`/activities/${activity.id}`)
                });
        }
    }

    const handleInputDlt = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        var dotDotdot = value;
        var tyTle = name;
        setActivity({
            ...activity, [tyTle]: dotDotdot
        });
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubaDubDub}>
                <Form.Input onChange={handleInputDlt} name='title' placeholder='Title' value={activity.title} />
                <Form.TextArea onChange={handleInputDlt} name='description' rows={2} placeholder='Description' value={activity.description} />
                <Form.Input onChange={handleInputDlt} name='category' placeholder='Category' value={activity.category} />
                <Form.Input onChange={handleInputDlt} name='date' type='datetime-local' placeholder='Date' value={activity.date} />
                <Form.Input onChange={handleInputDlt} name='city' placeholder='City' value={activity.city} />
                <Form.Input onChange={handleInputDlt} name='venue' placeholder='Venue' value={activity.venue} />
                <Button 
                    loading={submitting}
                    floated='right' 
                    positive type='submit' 
                    content='Submit'
                />
                <Button 
                    onClick={() => history.push('/activities')} //push user back to '/activities' 
                    floated='right' 
                    type='button' 
                    content='Cancel' 
                />
            </Form>
        </Segment>
    )
}
export default observer(ActivityForm);
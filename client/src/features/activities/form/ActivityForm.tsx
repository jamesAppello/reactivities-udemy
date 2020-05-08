import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<IProps> = ({ 
    setEditMode, 
    activity: initiaFormState,
    createActivity,
    editActivity 
}) => {

    const initializeForm = () => {
        if (initiaFormState) {
            return initiaFormState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubaDubDub = () => {
        console.log(activity);
        // determine whether or not you are creating or editing
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
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
                <Button floated='right' positive type='submit' content='Submit'/>
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}
export default ActivityForm;
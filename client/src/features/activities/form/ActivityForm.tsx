import React, { useState, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormVals } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import {Form as FinalForm, Field} from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { blendDT } from '../../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

const validate = combineValidators({
    //specify feilds to validate against
    title: isRequired({ message: 'So this event is called nothing? lol' }),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({ message: 'The people need to know what is going on during this event' })
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
})

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { 
        createActivity, 
        editActivity, 
        submitting,
        loadActivity,
    } = activityStore;


    const [activity, setActivity] = useState(new ActivityFormVals());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // we want to load an activity
        // only when we are editing is when we want to show the activity
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => { setActivity(new ActivityFormVals(activity)) })
                .finally(() => setLoading(false));
        };
        
    }, [
        loadActivity,
        match.params.id
    ]);

  

    const handleFinalFormSubmit = (values: any) => {
        // combine seperate date and time props into ONE
        const dateAndTime = blendDT(values.date, values.time);
        // ommit date n time seperate vals from values --> then add to our values the combined date and time('blendDT')
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
        console.log(activity);
    };


    return (
        <>
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <FinalForm 
                    validate={validate}
                    initialValues={activity}
                    onSubmit={handleFinalFormSubmit}
                    render={({handleSubmit, invalid, pristine}) => (
                        <Form onSubmit={handleSubmit} loading={loading}>
                            <Field //handlesubadubdub is replaced by handlesubmit for noe 
                                component={TextInput}
                                name='title' 
                                placeholder='Title' 
                                value={activity.title} />
                            <Field  
                                component={TextAreaInput}
                                name='description' rows={2} 
                                placeholder='Description' 
                                value={activity.description} />
                            <Field  
                                component={SelectInput} //will become a selectfield
                                options={category}
                                name='category' 
                                placeholder='Category' 
                                value={activity.category} />
                            <Form.Group widths='equal'>
                            
                            <Field //** NEED ONE FOR DATE && TIME! */
                                component={DateInput} 
                                name='date' 
                                date={true}
                                placeholder='Date' 
                                value={activity.date} />
                            <Field 
                                component={DateInput} 
                                name='time'
                                time={true} 
                                placeholder='Time' 
                                value={activity.time} />
                            </Form.Group>    
                            <Field 
                                // onChange={handleInputDlt}
                                component={TextInput} 
                                name='city' 
                                placeholder='City' 
                                value={activity.city} />
                            <Field 
                                component={TextInput} 
                                name='venue' 
                                placeholder='Venue' 
                                value={activity.venue} />
                            <Button 
                                loading={submitting}
                                disabled={loading || invalid || pristine}
                                floated='right' 
                                positive type='submit' 
                                content='Submit'
                            />
                            <Button 
                                onClick={activity.id ? 
                                    () => history.push(`/activities/${activity.id}`) 
                                    : 
                                    () => history.push('/activities')} 
                                disabled={loading}
                                floated='right' 
                                type='button' 
                                content='Cancel' 
                            />
                        </Form>
                    )}
                />
        </Segment>
            </Grid.Column>
        </Grid>
        
        </>
    );
}
export default observer(ActivityForm);
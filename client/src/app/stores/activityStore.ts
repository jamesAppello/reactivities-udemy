import { observable, action, computed, runInAction, configure} from 'mobx';
import 'mobx-react-lite/batchingForReactDom'; // this gets rid of the batching error!
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';


configure({ enforceActions: 'always' }); // initially adding strict mode will break the app
// to fix this we can override to allow the actions to run on observables.

class ActivityStore {
    // this is how we store our Activities
    @observable activityReg = new Map(); // this is to store activities into an observable map!
    @observable activity: IActivity | null = null; 
    @observable loadingInit = false;
    @observable submitting = false;
    @observable target = '';

    //we use computed props when we already have the data inside
    //the store ...BUT we can work out the final results should be based on existing data
    //data is usually best!
    @computed get activitiesByDate() { /** COMPUTED_PROPERTY   */
        return this.groupActivitiesByDate(Array.from(this.activityReg.values()));
    }; //ADD_HELPER_METHOD: groupActivitiesByDate

    groupActivitiesByDate(activities: IActivity[]) {
        // create [] for our sorted actvities
        const srtActvities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        // in development this is ow we can see what is happening
        return Object.entries(srtActvities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as  {[key: string]: IActivity[]}));
    }    


    // create an action
    // *in mobx we go to api to get activities and store them in observable
    // *bc we are going to be changing the state, it will be an array OF-TYPE- 'activity'
    @action loadActivArr = async () => {
        this.loadingInit = true; // in redux we cant use the 'this' KW bc we are mutating state
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities',() => { // we can give these 'runInAction'-methods names --> for MobX-DevTools
                activities.forEach(activity => {
                    activity.date = new Date(activity.date);
                    // this is for the O_Map
                    this.activityReg.set(activity.id, activity); // (key, value)*
                });    
                this.loadingInit = false;
            });
        } catch (err) {
            runInAction('load activites error',() => { // it is !mandatory to set a name to the runInAction methods
                this.loadingInit = false;
            });
            console.log(err);
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInit = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('get specific activity', () => {
                    activity.date = new Date(activity.date);
                    // set observable to the activity
                    this.activity = activity;
                    // store activtiy bet setting the activity in registry
                    this.activityReg.set(activity.id, activity);
                    this.loadingInit = false;
                });
                return activity;
            } catch (err) {
                runInAction('get activity exception', () => {
                    this.loadingInit = false;
                });
                console.log(err);
            }
        }
    };

    @action clearActivity = () => {
        this.activity = null;
    };

    // HELPER \/ -- for 'loadActivity'
    getActivity = (id: string) => {
        return this.activityReg.get(id);
    };
    
    @action createActivity = async (activity: IActivity) => {
        // add loading indicator
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('post new activity',() => {
                this.activityReg.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (err) {
            runInAction('new activity exception',() => {
                this.submitting = false;
            });
            toast.error('SUBMIT_ERROR:: check your fields!');
            console.log(err.response);
        }
    };


    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('change of plans', () => {
                this.activityReg.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (err) {
            runInAction('plan change exception', () => {
                this.submitting = false;
            });
            toast.error('SUBMIT_ERROR:: check your fields!');
            console.log(err.response);
        }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('not going anymore', () => {
                this.activityReg.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (err) {
            runInAction('bailout exception', () => {
                this.submitting = false;
                this.target = '';
            });
            console.log(err);
        }
    }
    
}


// use react contextAPI to put store into context
export default createContext(new ActivityStore());
// useContext hook in other files to use in components
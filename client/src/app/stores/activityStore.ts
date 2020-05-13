import { observable, action, computed, configure, runInAction} from 'mobx';
import 'mobx-react-lite/batchingForReactDom'; // this gets rid of the batching error!
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({ enforceActions: 'always' }); // initially adding strict mode will break the app
// to fix this we can override to allow the actions to run on observables.

class ActivityStore {
    // this is how we store our Activities
    @observable activityReg = new Map(); // this is to store activities into an observable map!
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined = undefined; //give a union type to be able to return a null value ** actually changed to undefined
    @observable loadingInit = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    //we use computed props when we already have the data inside
    //the store ...BUT we can work out the final results should be based on existing data
    //data is usually best!
    @computed get activitiesByDate() {
        return Array.from(this.activityReg.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
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
                    activity.date = activity.date.split('.')[0];
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
    
    @action createActivity = async (activity: IActivity) => {
        // add loading indicator
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('post new activity',() => {
                this.activityReg.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            });
        } catch (err) {
            runInAction('new activity exception',() => {
                this.submitting = false;
            });
            console.log(err);
        }
    };


    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('change of plans', () => {
                this.activityReg.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
        } catch (err) {
            runInAction('plan change exception', () => {
                this.submitting = false;
            });
            console.log(err);
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

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityReg.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityReg.get(id);
        this.editMode = false;
    }
}


// use react contextAPI to put store into context
export default createContext(new ActivityStore());
// useContext hook in other files to use in components
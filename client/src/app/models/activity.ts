// when we want string typing against the object thats when we want to use an interface
// mainly used for type-checking
// class will get transpiled into js...this will not
// which makes us need to write less code when we use interfaces!
export interface IActivity {
    // describe structure of activity object
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
}

// iterface for FORM PROPS
export interface IActivityFormVals extends Partial<IActivity> {
    time?: Date
}

export class ActivityFormVals implements IActivityFormVals {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue: string = '';
    // add a contructor that creates a new instance with the fields from memory
    constructor(init?: IActivityFormVals) {
        if (init && init.date) {
            init.time = init.date;
        }
        Object.assign(this, init);
    }
}
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
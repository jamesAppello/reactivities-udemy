import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';


axios.defaults.baseURL = 'http://localhost:5000/api';

const resBody = (res: AxiosResponse) => res.data;

//transform a function into multiple arguments
const sleep = (ms: number) => 
    (res: AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => 
        setTimeout(() => resolve(res), ms)); // wait a second before sending request


const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(resBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(resBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(resBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(resBody)
};

// activities objects to add requests
const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
};

export default {
    Activities
};
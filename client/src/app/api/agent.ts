import axios, { AxiosResponse } from 'axios'; // to intercept any errors from the req and|or response
import { IActivity } from '../models/activity';
import { history } from '../..'; // refering to exported history object from the index.tsx file
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api';
// add an interceptor
// undefined because we are only dealing with the exception part of the response
axios.interceptors.response.use(undefined, error => {

    // network-error | EXCEPTION 
    if (error.message === 'Network Error' && !error.response) {
        toast.error('A NETWORK_ERROR HAS OCCURED: are we all hooked up properly?')
    }

    // destructure response object to save typing
    const { status, data, config } = error.response;
    if (status === 404) {
        history.push('/sorry-we-could-not-find-what-you-were-looking-for');
    }
    // check the error for request-response data
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/sorry-we-could-not-find-what-you-were-looking-for');
    }
    if (status === 500) {
        toast.error('INTERNAL_SERVER_ERROR');
    }
    throw error;
});

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

import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'; //acts as a middlemand for props-state from store
import { observer } from 'mobx-react-lite';
import { 
  Route, 
  withRouter, // higher order component --> takes App as param --> returns new App component with rootProps to access 
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';


const App: React.FC<RouteComponentProps> = ({ location }) => {

    // RENDER
    return (
      <>
        <ToastContainer position='bottom-right' />
        <Route exact path='/' component={HomePage} />
        <Route 
          path={'/(.+)'} //route&anythingElse will match 
          render={() => (
            <>
            <NavBar />
            <Container style={{marginTop: '7em'}}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                <Route component={NotFound}/>
              </Switch>
            </Container>
            </>
          )}
        />
      </>
    );
};

export default withRouter(observer(App));

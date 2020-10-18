import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LocationProvider } from './components/context/LocationContext'
import Header from './components/header';
import Footer from "./components/footer";
// Code-splitting is automated for `routes` directory
import Account from "./routes/account";
import Explore from "./routes/explore";
import Support from "./routes/support";
import Login from "./routes/login";
import Logout from "./routes/logout";
import Request from "./routes/request_room";
import Landing from './routes/landing';
import Dashboard from './routes/dashboard';
import Faq from './routes/help';
import { Docs } from './routes/docs';
import { UserProvider } from './components/context/UserContext';

const App = () => (
  <React.Fragment>
    <UserProvider>
      <LocationProvider>
        <Router>
          <Header />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path="/account" component={Account} />
            <Route path="/explore" component={Explore} />
            <Route path="/support" component={Support} />
            <Route path="/request" component={Request} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/help" component={Faq} />
            <Route path="/docs" component={Docs} />
          </Switch>
          <Footer />
        </Router>
      </LocationProvider>
    </UserProvider>
  </React.Fragment>
)

export default App;

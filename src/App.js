import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthStatus'
import Header from './components/header';
import Footer from "./components/footer";

// Code-splitting is automated for `routes` directory
import Landing from "./routes/landing"
import Dashboard from "./routes/dashboard"
import Account from "./routes/account";
import Explore from "./routes/explore";
import Support from "./routes/support";
import Login from "./routes/login";
import Logout from "./routes/logout";
import Request from "./routes/request_room";
const App = () => (
  <>
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/account" component={Account} />
          <Route path="/explore" component={Explore} />
          <Route path="/support" component={Support} />
          <Route path="/request" component={Request} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>


  </>
)

export default App;

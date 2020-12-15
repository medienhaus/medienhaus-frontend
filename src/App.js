import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LocationProvider } from "./components/context/LocationContext"
import { UserProvider } from "./components/context/UserContext";
import Header from "./components/header";
import Footer from "./components/footer";
import Nav from "./components/nav";

// Code-splitting is automated for `routes` directory
import Account from "./routes/account";
import Explore from "./routes/explore";
import Request from "./routes/request";
import Support from "./routes/support";
import Kino from "./routes/kino";

import Meet from "./routes/meet";
import Write from "./routes/write";
import Stream from "./routes/stream";

import Login from "./routes/login";
import Landing from "./routes/landing";
import Dashboard from "./routes/dashboard";
import Admin from "./routes/admin";

const App = () => (
  <React.Fragment>
    <UserProvider>
      <LocationProvider>
        <Router>
          <Header />
          <main>
            <Switch>
              {localStorage.getItem('mx_access_token') === null ? (
                <>
                  <Route path="/" exact component={Landing} />
                  <Route path="/login" component={Login} />
                  <Route path="/dashboard" component={Login} />
                  <Route path="/account" component={Login} />
                  <Route path="/explore" component={Login} />
                  <Route path="/request" component={Login} />
                  <Route path="/support" component={Login} />
                  <Route path="/kino" component={Login} />
                  <Route path="/meet" component={Login} />
                  <Route path="/write" component={Login} />
                  <Route path="/stream" component={Login} />
                </>
              ) : (
                  <>
                    <Route path="/" exact component={Landing} />
                    <Route path="/login" component={Login} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/account" component={Account} />
                    <Route path="/explore" component={Explore} />
                    <Route path="/request" component={Request} />
                    <Route path="/support" component={Support} />
                    <Route path="/kino" component={Kino} />
                    <Route path="/meet" component={Meet} />
                    <Route path="/write" component={Write} />
                    <Route path="/stream" component={Stream} />
                    <Route path="/admin" component={Admin} />
                  </>)
              }
            </Switch>
          </main>
          <Nav />
          <Footer />
        </Router>
      </LocationProvider>
    </UserProvider>
  </React.Fragment>
)

export default App;

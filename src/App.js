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
import Support from "./routes/support";
import Request from "./routes/request";

import Faq from "./routes/faqs";
import { Docs } from "./routes/docs";

import Login from "./routes/login";
import Logout from "./routes/logout";

import Landing from "./routes/landing";
import Dashboard from "./routes/dashboard";

const App = () => (
  <React.Fragment>
    <UserProvider>
      <LocationProvider>
        <Router>
          <Header />
          <main>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/account" component={Account} />
              <Route path="/explore" component={Explore} />
              <Route path="/support" component={Support} />
              <Route path="/request" component={Request} />
              <Route path="/faqs" component={Faq} />
              <Route path="/docs" component={Docs} />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
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

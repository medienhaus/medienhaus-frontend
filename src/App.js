import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'
import Nav from './components/nav'

// Code-splitting is automated for `routes` directory
import Account from './routes/account'
import Explore from './routes/explore'
import Request from './routes/request'
import Support from './routes/support'
import Kino from './routes/kino'

import Meet from './routes/meet'
import Write from './routes/write'
import Stream from './routes/stream'

import Login from './routes/login'
import Landing from './routes/landing'
import Dashboard from './routes/dashboard'
import Admin from './routes/admin'

import { AuthProvider, useAuth } from './Auth'
import { Loading } from './components/loading'

function PrivateRoute ({ children, ...rest }) {
  const auth = useAuth()
  const location = useLocation()

  // Still loading...
  if (auth.user === null) {
    return <Loading/>
  }

  // Not logged in
  if (auth.user === false) {
    return <Redirect
      to={{
        pathname: '/login',
        state: { from: location }
      }}
    />
  }

  // Logged in - render our actual route components
  return (
    <Route {...rest}>{children}</Route>
  )
}

const App = () => (
  <React.Fragment>
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/account" component={Account} />
            <PrivateRoute path="/explore" component={Explore} />
            <PrivateRoute path="/request" component={Request} />
            <PrivateRoute path="/support" component={Support} />
            <PrivateRoute path="/kino" component={Kino} />
            <PrivateRoute path="/meet" component={Meet} />
            <PrivateRoute path="/write" component={Write} />
            <PrivateRoute path="/stream" component={Stream} />
            <PrivateRoute path="/admin" component={Admin} />
          </Switch>
        </main>
        <Nav />
        <Footer />
      </Router>
    </AuthProvider>
  </React.Fragment>
)

export default App

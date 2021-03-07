import React, { Suspense } from 'react'
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

import Login from './routes/login'
import Landing from './routes/landing'
import Dashboard from './routes/dashboard'
import Admin from './routes/admin'

import { AuthProvider, useAuth } from './Auth'
import { Loading } from './components/loading'
import PropTypes from 'prop-types'

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

PrivateRoute.propTypes = {
  children: PropTypes.element
}

const App = () => (
  <React.Fragment>
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/account" component={Account} />
              <PrivateRoute path="/explore" component={Explore} />
              <PrivateRoute path="/request" component={Request} />
              <PrivateRoute path="/support" component={Support} />
              <PrivateRoute path="/kino" component={Kino} />
              <PrivateRoute path="/admin" component={Admin} />
            </Switch>
          </Suspense>
        </main>
        <Nav />
        <Suspense fallback="">
          <Footer />
        </Suspense>
      </Router>
    </AuthProvider>
  </React.Fragment>
)

export default App

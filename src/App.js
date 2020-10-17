import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthStatus'
import Header from './components/header';
import Footer from "./components/footer";

// Code-splitting is automated for `routes` directory
import Account from "./routes/account";
import Explore from "./routes/explore";
import Support from "./routes/support";
import Login from "./routes/login";
import Logout from "./routes/logout";
import Request from "./routes/request_room";
const App = () => (
  <React.Fragment>
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" />
          <Route path="/account" component={Account} />
          <Route path="/explore" component={Explore} />
          <Route path="/support" component={Support} />
          <Route path="/request" component={Request} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
        </Switch>
        <section id="definition">
          <blockquote><em>classroom, n.</em> &mdash; shared space to <strong>communicate</strong> and exchange, <strong>meet</strong> face to face, <strong>present</strong> to each other, and <strong>study</strong> together.</blockquote>
        </section>
        <section id="introduction">
          <p><a href="https://www.udk-berlin.de/en/university/college-of-architecture-media-and-design/medienhaus/" rel="nofollow noreferrer" target="_blank">Medienhaus</a> is the media design and art department of Berlin University of the Arts; it is an experimental playground shared amongst Visual Communication, Art and Media, and Communication in Social and Economic Contexts.</p>
          <p>As the COVID-19 pandemic happened, we quickly needed to provide an intuitive remote collaboration platform, satisfying the requirements and needs of an art school during this crisis and beyond.</p>
          <p>We rapidly prototyped and iteratively enhanced a privacy-focused, free and open-source set of tools and services for our students and staff, <em>which we soon want to share in form of documentation and automated installation scripts.</em></p>
        </section>
        <section id="shoutout">
          <blockquote>We developed <strong>medienhaus/</strong> &mdash; not replacing but extending the name-giving physical space.</blockquote>
        </section>
        <section id="services">
          <ul>
            <li><strong>/classroom</strong> asynchronous communication space</li>
            <li><strong>/meet</strong> audio/video collaboration and presentation</li>
            <li><strong>/write</strong> collaborative writing, reading, and editing</li>
            <li><strong>/stream</strong> audio/video live streaming and playback</li>
          </ul>
        </section>
        <section id="team">
          <h2><strong>Team</strong> (sorted alphabetically):</h2>
          <ul>
            <li>Alexej Bormatenkow</li>
            <li>Dirk Erdmann</li>
            <li><a href="mailto:kg@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Klaus Gasteier</a></li>
            <li>Marcel Haupt</li>
            <li><a href="mailto:dh@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Daniel Hromada</a></li>
            <li>Frederik Müller</li>
            <li>Andi Rueckel</li>
            <li>Merani Schilcher</li>
            <li><a href="mailto:rfws@udk-berlin.de?subject=medienhaus/" rel="external nofollow noreferrer">Robert Schnüll</a></li>
            <li>Paul Seidler</li>
          </ul>
        </section>
        <Footer />
      </Router>
    </AuthProvider>
  </React.Fragment>
)

export default App;

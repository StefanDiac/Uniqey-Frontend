import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link

} from 'react-router-dom';
import $ from 'jquery';

//components
import Header from './Components/headerComponent/header'
import Footer from './Components/footerComponent/footer'
import Homepage from './Components/pages/homePage'
import Keys from './Components/pages/keys'
import Generate from './Components/pages/generate'

//includes
import './Assets/css/default.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
           <Route exact path='/' component={Homepage} />
           <Route exact path='/keys' component={Keys} />
           <Route exact path='/generate' component={Generate} />
        </div>
      </Router>
    );
  }
}

export default App;

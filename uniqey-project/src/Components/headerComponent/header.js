import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <div className="logo">
          LOGO
        </div>

        <nav>
          <ul>
            <li className="first">
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/keys">View Keys</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;

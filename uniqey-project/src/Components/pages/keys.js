import React, { Component } from 'react';
import axios from 'axios';
var email;
var htmlKeys = [];
class Keys extends Component {

  constructor(props) {
    super(props);
    this.onAuthenticate = this.onAuthenticate.bind(this);

    this.state = {
      keys: []
    }
  }

  componentDidMount(){
    const googleApiScript = document.createElement('script');
    googleApiScript.src = 'https://apis.google.com/js/api.js';
    googleApiScript.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
            'apiKey': 'AIzaSyARPRlFO6ZnHOa31_hb1h39KUV0D54QlwQ',
            'clientId': '651588764951-02ma8di4qm1svd724nldmie5m2ktvbu2.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me',
            'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        }).then(function () {
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(() => {
          });
        });
      });
    };
    googleApiScript.onerror = (err) => {
      console.log(err);
    }
    document.body.appendChild(googleApiScript);
  }

  onAuthenticate(event){
    window.gapi.auth2.getAuthInstance().signIn();

    window.gapi.client.request({
      'path': 'https://www.googleapis.com/plus/v1/people/me',
      'method': 'GET'
    }).then(function(jsonResp, rawResp){
        email = jsonResp.result.emails[0].value;
        axios.get('http://localhost:3505/displayMyUIDs/'+ email)
        .then(function(resp){
          var keyDetails = [];
          var respKeys = resp.data;
          for(var i = 0; i<respKeys.length; i++) {
            keyDetails.push(<tr key={i}><td>{respKeys[i].UID}</td><td>{respKeys[i].Type}</td></tr>);
          }
          htmlKeys = keyDetails;
        }).catch(function(err){
          console.log(err);
        })
    });
  }

  loadKeys = () => {
    this.setState({
      keys: htmlKeys
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <h1>
          Your Uniqeys
        </h1>
        <button type="button" onClick={this.onAuthenticate}>Authenticate</button>
        <button type="button" onClick={this.loadKeys}>Load Keys</button>
        <table className="keysTable">
          <tbody>
            <tr>
              <th>Uniqey</th>
              <th>Document Type</th>
            </tr>
            {this.state.keys}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Keys;

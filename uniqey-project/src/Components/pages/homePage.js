import React, { Component } from 'react';
import axios from 'axios';
var selectOptions = [];
var showSelect = false;
var email;
var displayName;
var gotPermissions = false;
var selectedOption = "Generic File";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.onLoginClicked = this.onLoginClicked.bind(this);

    this.state = {isShowingSelect: false}
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

  onLoginClicked(event) {
    window.gapi.auth2.getAuthInstance().signIn();

    var body = {
      'name': 'Uniqey-folder',
      'mimeType': 'application/vnd.google-apps.folder',
    };
    window.gapi.client.request({
      'path': 'https://www.googleapis.com/plus/v1/people/me',
      'method': 'GET'
    }).then(function(jsonResp, rawResp){
      if(jsonResp.status === 200) {
        email = jsonResp.result.emails[0].value;
        displayName = jsonResp.result.displayName;

        axios.post('http://localhost:3505/', {
            name: displayName,
            Email: email
        }).then(function(res){
            console.log(res);
        }).catch(function(err){
            console.log(err);
        });
      }else{
        console.log('Something went wrong while trying to get your email and display name');
      }
    });

    //Drive Requests for setting up generation
    window.gapi.client.request({
      'path': 'https://www.googleapis.com/drive/v3/files/',
      'method': 'GET',
      'params' : {'q': "name = 'Uniqey-folder'"}
    }).then(function(jsonResp, rawResp){
      if(jsonResp.result.files.length > 0){
        alert('Welcome back user!');
        var folderId = jsonResp.result.files[0].id;
        window.gapi.client.request({
          'path': 'https://www.googleapis.com/drive/v2/files/' + folderId + '/children',
          'method': 'GET'
        }).then(function(jsonResp, rawResp){
          if(jsonResp.result.items.length>0){
            for(var i = 0; i<jsonResp.result.items.length; i++){
              var itemID = jsonResp.result.items[i].id;

              window.gapi.client.request({
                'path': 'https://www.googleapis.com/drive/v3/files/' + itemID,
                'method': 'GET'
              }).then(function(jsonResp, rawResp){
                selectOptions.push({key: i,name: jsonResp.result.name});
              });
            }
          }
          showSelect = true;
        });
      }else{
        window.gapi.client.request({
          'path': 'https://www.googleapis.com/drive/v3/files/',
          'method': 'POST',
          'body': body
        }).then(function(jsonResp, rawResp){
          if(jsonResp.status === 200){
            alert("Created a folder called Uniqey-folder inside of your drive, please add all the file types there");
            showSelect = true;
          }else{
            alert("Something went wrong :(");
          }
        });
      }
    });
  }

  onShowGenerator = () => {
      if(showSelect === true) {
        this.setState({isShowingSelect: true});
    } else {
        alert("You should log in first");
    }
  }

  render() {
    return (
      <div className="container-fluid" id="loginContainer">
        <h1>
          Welcome to Uniqey !
        </h1>
        <p>To start please sign into using your dropbox account</p>
        <button type="button" onClick={this.onLoginClicked}>Sign In With Google Drive</button>
        <button type="button" onClick={this.onShowGenerator}>Start Generating</button>
        {this.state.isShowingSelect ? <GenerationOptions /> : null}
      </div>
    );
  }
}

export default Homepage;

class GenerationOptions extends Component {
  constructor(props, context){
    super(props, context);

    this.state = {
      options:[]
    };
  }

  componentDidMount(){
    if(selectOptions.length === 0) {
      alert("There are no files in your folder ! Please add some for diversity, otherwise we will create UIDs for generic files");
    }else{
      var optArr = [];
      for(var i = 0; i<selectOptions.length; i++){
        optArr.push(<option value={selectOptions[i].name} key={selectOptions[i].key}> {selectOptions[i].name} </option>);
      }
      this.setState({
        options: optArr
      });
    };
  }

  handleClick = () => {
    console.log(selectedOption);
    axios.post('http://localhost:3505/generate', {
      Type: selectedOption,
      Email: email
    }).then(function(res){
      console.log(res);
    }).catch(function(err){
      console.log(err);
    });
  }

  updateValue = (e) => {
    var selectElem = document.getElementById("optionsID");
    selectedOption = selectElem.options[selectElem.selectedIndex].value;
  }

  render(){
    return (
      <div className="generationElem">
        <select onChange={this.updateValue} id="optionsID">
          <option value="Generic File">Generic File</option>
          {this.state.options}
        </select>
        <button type="button" onClick={this.handleClick}>Generate Uniqey</button>
      </div>
    );
  }
};

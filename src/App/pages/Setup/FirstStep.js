import React, { Component } from 'react';
import {
  TextInput, TextArea, TextInputSkeleton
} from 'carbon-components-react';
import SetupHeader from './SetupHeader';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

const HeaderProps = {
  title: `Provide your identity provider information`,
  description: `We don't just trust anyone. To get started, all you need to provide is your
  identity provider's login & logout URLs, and the certificate. With this we
  will know who to send the single-sign on request to.`
}



class FirstStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        success: false,
        loginurl: null,
        logouturl: null,
        certificate: null
      };
    // This binding is necessary to make `this` work in the callback
    this.handleChangeLoginURL = this.handleChangeLoginURL.bind(this);
    this.handleChangeLogoutURL = this.handleChangeLogoutURL.bind(this);
    this.handleChangeCert = this.handleChangeCert.bind(this);
    this.preloadCheck = this.preloadCheck.bind(this);
  }

  create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  componentDidMount(){

   var uuid = cookies.get('sample-saml-cookie');
   if (!uuid) {
     uuid = this.create_UUID();
     if (window.location.protocol === 'https:') {
       cookies.set('sample-saml-cookie', uuid, {
         path: '/',
         maxAge: '2147483647',
         sameSite: 'none',
         secure: true
       });
     } else {
       cookies.set('sample-saml-cookie', uuid, {
         path: '/',
         maxAge: '2147483647',
         sameSite: 'none'
       });
     }
   }

    var myHeaders = new Headers();

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`/api/v1.0/config/properties?uuid=${uuid}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        var precheck = JSON.parse(result)
        console.log(precheck)
        if(precheck.code == '201'){
          this.setState({
            loading: false,
            success: true,
            loginurl: precheck.message.loginurl,
            logouturl: precheck.message.logouturl,
            certificate: precheck.message.certificate
          })
          this.preloadCheck(precheck.message.loginurl, precheck.message.logouturl, precheck.message.certificate)
        }
      })
      .catch(error => console.log('error', error));
  }
  preloadCheck(loginurl, logouturl, certificate) {
    var preloadVars = {
      loginurl: loginurl,
      logouturl: logouturl,
      certificate: certificate,
      preload: true
    }
    this.props.preload(preloadVars)
  }
  handleChangeLoginURL(e) {
    var newState = {
      key: 'loginurl',
      value: e.target.value
    }
    this.props.func(newState)
  }
  handleChangeLogoutURL(e) {
    var newState = {
      key: 'logouturl',
      value: e.target.value
    }
    this.props.func(newState)
  }
  handleChangeCert(e) {
    var newState = {
      key: 'certificate',
      value: e.target.value
    }
    this.props.func(newState)
  }
  render() {
    return (
      <div className="bx--row setup-content">
        <SetupHeader
        title={HeaderProps.title}
        description={HeaderProps.description}
        />
        <div className="bx--col-lg-6 bx--col-md-6">
          <div className="setup-content-options">
            {this.state.loading ? (
              <div>
                <TextInputSkeleton className="setup-input"/>
                <TextInputSkeleton className="setup-input"/>
                <TextInputSkeleton className="setup-input"/>
              </div>
            ): (
              <div>
                <div className="setup-input">
                  <TextInput
                    disabled={false}
                    id="login"
                    labelText="Login URL"
                    placeholder="https://youridp.../login"
                    defaultValue={(this.state.success ? (this.state.loginurl) : (null))}
                    type="text"
                    onLoad={this.handleChangeLoginURL}
                    onChange={this.handleChangeLoginURL}
                    />
                </div>
                <div className="setup-input">
                  <TextInput
                    disabled={false}
                    id="logout"
                    labelText="Logout URL"
                    placeholder="https://youridp.../signout"
                    defaultValue={(this.state.success ? (this.state.logouturl) : (null))}
                    type="text"
                    onChange={this.handleChangeLogoutURL}
                    />
                </div>
                <div className="setup-input">
                  <TextArea
                  disabled={false}
                  hideLabel={false}
                  labelText='Paste in the plain text certificate'
                  helperText='Ensure you include the begin and end lines of the certificate'
                  placeholder= {`-----BEGIN CERTIFICATE-----\r\n...\r\n...\r\n-----END CERTIFICATE-----`}
                  defaultValue={(this.state.success ? (this.state.certificate) : (null))}
                  id='certificate'
                  rows={4}
                  onChange={this.handleChangeCert}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default FirstStep;

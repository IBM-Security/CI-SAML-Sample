import React, { Component } from 'react';
import {
  TextInput, TextArea, TextInputSkeleton
} from 'carbon-components-react';
import SetupHeader from './SetupHeader'

const HeaderProps = {
  title: `Provide your identity provider information`,
  description: `We don't just truyst anyone. To get started, all you need to provide is your
  identity provider's login & logout URLs, and the certificate. With this we can
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
  componentDidMount(){
    var myHeaders = new Headers();

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3006/api/v1.0/setup/config", requestOptions)
      .then(response => response.text())
      .then(result => {
        var precheck = JSON.parse(result)
        console.log(precheck)
        if(precheck.code == '201'){
          this.setState({
            loading: false,
            success: true,
            loginurl: precheck.config.login,
            logouturl: precheck.config.logout,
            certificate: precheck.config.certificate
          })
          this.preloadCheck(precheck.config.login, precheck.config.logout, precheck.config.certificate)
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

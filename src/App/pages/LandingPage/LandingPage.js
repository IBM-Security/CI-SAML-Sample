import React, { Component } from 'react';
import {
  Link,
  Breadcrumb,
  BreadcrumbItem,
  ClickableTile,
  CodeSnippet
 } from 'carbon-components-react';
import Footer from '../InfoFooter/Footer';
import { Settings24, Login24, UserIdentification24, Logout24 } from '@carbon/icons-react';
import * as QueryString from "query-string";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class LandingPage extends Component {
  // Initialize the state
  state = {
    loading: true,
    session: false,
    setup: false,
    setupAllowed: true,
    showSession: false
  }

  componentDidMount() {

    const params = QueryString.parse(this.props.location.search);
    var https = (window.location.protocol === 'https:');

    if (params.uuid == "reset" ) {
      console.log("resetting cookie");
      if (https) {
        cookies.remove('sample-saml-cookie', {path: '/', sameSite: 'none', secure: true});
      } else {
        cookies.remove('sample-saml-cookie', {path: '/', sameSite: 'none'});
      }
    } else {
      if (typeof params.uuid !== 'undefined') {
        if (https) {
          cookies.set('sample-saml-cookie', params.uuid, {
            path: '/',
            maxAge: '2147483647',
            sameSite: 'none',
            secure: true
          });
        } else {
          cookies.set('sample-saml-cookie', params.uuid, {
            path: '/',
            maxAge: '2147483647',
            sameSite: 'none'
          });
        }
      }
    }
    var uuid = cookies.get('sample-saml-cookie');
    var uuidQueryString = (typeof uuid !== 'undefined' ? `?uuid=${uuid}` : '' );
    var uuidString = (typeof uuid !== 'undefined' ? `${uuid}` : 'default' );

    fetch(`/api/v1.0/config/status${uuidQueryString}`)
    .then(res => res.json())
    .then((data) => {
      (data.status == true) ?
        this.setState({setup: true}) : this.setState({setup: false});
      (data.allowed == true) ?
        this.setState({setupAllowed: true}) : this.setState({setupAllowed: false});
    })
    .catch(console.log)

    //Use Session data
    // fetch(`/api/v1.0/static/session`)
    //Use static data
    fetch(`/api/v1.0/session/active`)
    .then(res => res.json())
    .then((data) => {
      this.setState({
        // data = {session: active} // is active
        // data = {session: inactive} // is nnot active
        session: (data.session == 'active') ? true : false,
        loading: false
       })
    })
    .catch(console.log)

  }
  copyuuid = () => {
  	let copiedText = '';
  	var codeSnippetElement = document.querySelectorAll('#uuid > div > code > pre');
  	if (codeSnippetElement) {
  		copiedText = codeSnippetElement[0].innerHTML;
  	}
  	var textArea = document.createElement('textarea');
  	textArea.value = copiedText;
  	document.body.appendChild(textArea);
  	textArea.select();
  	document.execCommand('Copy');
  	textArea.remove();
  };

  toggleSession = () => {
      if(this.state.showSession == true){
        this.setState({ showSession: false });
      }
      else{
        this.setState({ showSession: true });
      }
  }

  render() {
    var uuid = cookies.get('sample-saml-cookie');
    var uuidString = (typeof uuid !== 'undefined' ? `${uuid}` : 'default' );

    //console.log(this.state);
    return (
      <div className="bx--grid landing-page">
        <div className="bx--row landing-page__breadcrumb">
          <div className="bx--col-lg-12">
            <Breadcrumb aria-label="Page navigation" noTrailingSlash>
              <BreadcrumbItem>
                <a href="http://developer.ice.ibmcloud.com/">Developer SDK</a>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
        <div className="bx--row landing-page__banner">
          <div className="bx--col-lg-12">
            <h1 className="landing-page__heading">
              SAML application service provider
            </h1>
          </div>
        </div>
        <div className="bx--row landing-page__r2">
            <div className="bx--col-md-4 bx--col-lg-7">
              <p className="landing-page__p">
                Use this application to test SSO with IBM Security Verify.
                This sample app can be reused in your own applications or
                simply used for testing purposes. Try applying access policies
                to this application to see MFA in action, or play around with newly
                created attributes.
              </p>
              <h1 className="landing-page__gettingstarted">
                Getting started
              </h1>
              { this.state.setup ?
                  this.state.session && !this.state.loading ? (
                    <>
                      <ClickableTile className="landing-page_primary" href="/profile">
                      View profile
                      <UserIdentification24 aria-label="Profile" />
                      </ClickableTile>
                      <ClickableTile className="landing-page_button1" href="/logout">
                        Logout
                        <Logout24 aria-label="Logout" />
                      </ClickableTile>
                    </>
                  ) : (
                    <>
                      <ClickableTile className="landing-page_primary" clicked={false} href="/login">
                        Login
                        <Login24 aria-label="Login" />
                      </ClickableTile>
                    </>
                  )
                :
                ('')
              }
              { this.state.setupAllowed ? (
              <ClickableTile className="landing-page_secondary" clicked={false} href="/setup">
                Setup
                <Settings24 aria-label="Settings" />
              </ClickableTile>
            ) : ('')
          }
              <p className="landing-page__p">
                Once you configure your identity provider, the configuration is tied to your browser session. The session identifier 
                can be used to identify your specific configuration. Click the link below to view the session configuration information. 
                <br /><br />
                  { this.state.showSession ? 
                  (
                  <div>
                    <Link 
                    className="some-class"
                    href="#"
                    onClick={this.toggleSession}>
                    Hide session identifier</Link>
                    <CodeSnippet 
                    type='single'
                    feedback="Copied to clipboard"
                    type="single"
                    onClick={this.copyuuid}
                    id="uuid"
                    className="ci--sessionId">
                    {`${uuidString}`}
                    </CodeSnippet>
                  </div>
                  ) : (
                    <Link 
                  className="some-class"
                  href="#"
                  onClick={this.toggleSession}>
                  View session identifier</Link>
                  ) }
              </p>
            </div>
        </div>
        <Footer text="Need help?" link="/" linktext="Visit the knowledge center" className="landing-page__r3" />
      </div>
    )
  }
}
export default LandingPage;

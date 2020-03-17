import React, { Component } from 'react';
import {
  CodeSnippet, Link
} from 'carbon-components-react';
import SetupHeader from './SetupHeader';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const currentHost = process.env.REACT_APP_HOSTNAME;
const entityId = process.env.REACT_APP_ENTITYID;

const HeaderProps = {
  title: `You have to trust us too.`,
  description: `Copy the URLs below or download the metadata and import it to your identity provider. If you don’t complete this step, you’re going to have a bad time.`
}


class SecondStep extends Component {

  // Initialize the state
  state = {
    entityid: "",
    acs: "",
    ssotrigger: ""
  }

  componentDidMount() {
    fetch(`/api/v1.0/config/saml`)
    .then(res => res.json())
    .then((data) => {
      (data.entityid) && this.setState({entityid: data.entityid});
      (data.acs) && this.setState({acs: data.acs});
      (data.ssotrigger) && this.setState({ssotrigger: data.ssotrigger});
    })
    .catch(console.log)
  }

  // IE and Edge don't support ClipBoard API
  // execCommand Copy only allows copying from visible input fields.
  // So we take the value in the <pre> tag, put it in a textArea, then copy from there, then remove textArea.
  copyEntity = () => {
  	let copiedText = '';
  	var codeSnippetElement = document.querySelectorAll('#entity > div > code > pre');
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
  copyLogin = () => {
  	let copiedText = '';
  	var codeSnippetElement = document.querySelectorAll('#copylogin > div > code > pre');
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
  copyAcs = () => {
  	let copiedText = '';
  	var codeSnippetElement = document.querySelectorAll('#acs > div > code > pre');
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

  render() {
    var uuid = cookies.get('sample-saml-cookie');
    var uuidQueryString = (typeof uuid !== 'undefined' ? `?uuid=${uuid}` : '' );

    return (
      <div className="bx--row setup-content">
        <SetupHeader
        title={HeaderProps.title}
        description={HeaderProps.description}
        />
        <div className="bx--col-lg-8 bx--col-md-6">
          <div className="setup-content-options">
            <p className="step-label">Provider ID</p>
            <CodeSnippet
              ariaLabel="Container label"
              copyButtonDescription="copyable code snippet"
              feedback="Copied to clipboard"
              type="single"
              onClick={this.copyEntity}
              id="entity"
            >
              {this.state.entityid}
            </CodeSnippet>
            <p className="step-label">Assertion Consumer Service URL (ACS)</p>
            <CodeSnippet
              ariaLabel="Container label"
              copyButtonDescription="copyable code snippet"
              feedback="Copied to clipboard"
              type="single"
              onClick={this.copyAcs}
              id="acs"
            >
              {this.state.acs}
            </CodeSnippet>
            <p className="step-label">Single Sign-On (SSO) URL</p>
            <CodeSnippet
              ariaLabel="Container label"
              copyButtonDescription="copyable code snippet"
              feedback="Copied to clipboard"
              type="single"
              onClick={this.copyLogin}
              id="copylogin"
            >
              {this.state.ssotrigger + uuidQueryString}
            </CodeSnippet>
          </div>
          <div className="step-spacing">
          or
          </div>
          <div>
            <a href="/metadata.xml" target="_blank">
              Download metadata
            </a>
          </div>
        </div>
      </div>
    )
  }
};
export default SecondStep;

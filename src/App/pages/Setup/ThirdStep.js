import React, {Component} from 'react';
import {
 Button,
 InlineLoading
} from 'carbon-components-react';
import SetupHeader from './SetupHeader'

const HeaderProps = {
  title: `Setup complete`,
  description: `Everything you provided looks good. Go ahead and try to log in. If you see errors, you can always come back here to make changes.`
}
const LoadingProps = {
  title: `Setup in progress`,
  description: `We are setting the values you provided. It should only take a few seconds.`
}

class ThirdStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      loading: true,
      success: false,
      loginurl: this.props.params.loginurl,
      logouturl: this.props.params.logouturl,
      certificate: this.props.params.certificate,
    }
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("loginurl", this.state.loginurl);
    urlencoded.append("logouturl", this.state.logouturl);
    urlencoded.append("certificate", this.state.certificate);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(`/api/v1.0/config/properties`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .then((data) => {
        this.setState({
          loading: false
        })})
      .catch(error => console.log('error', error));
  }
  render(){
    return (
      <div className="bx--row setup-content">
        { this.state.loading ? (
          <div>
            <SetupHeader
            title={LoadingProps.title}
            description={LoadingProps.description}
            />
            <InlineLoading
              description="Setup in progress..."
              iconDescription="Setup in progress..."
              status="active"
              successDelay={1500}
              className="setup-in-progress bx--col-lg-16"
            />
          </div>
        ) : (
          <div>
            <SetupHeader
            title={HeaderProps.title}
            description={HeaderProps.description}
            />
            <div className="bx--col-lg-6 bx--col-md-6">
              <div className="setup-content-options">
              <a href="/login">
              <Button kind="primary" className="button-login">Login now</Button>
              </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};
export default ThirdStep;

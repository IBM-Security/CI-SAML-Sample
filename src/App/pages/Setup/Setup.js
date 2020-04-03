import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from 'carbon-components-react';
import Footer from '../InfoFooter/Footer';
import SetupProgress from './SetupProgress';
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showResults: false,
        progressStep: 0,
        loginurl: '',
        logouturl: '',
        certificate: '',
        preload: false
      };

    // This binding is necessary to make `this` work in the callback
    this.increaseStep = this.increaseStep.bind(this);
    this.decreaseStep = this.decreaseStep.bind(this);
    this.output = this.output.bind(this);
    this.preload = this.preload.bind(this);
  }
  output(evt) {
        console.log(evt)
        var key = evt.key;
        var value = evt.value;
        this.setState({[key]: value})
    }
  preload(evt) {
        this.setState({
        loginurl: evt.loginurl,
        logouturl: evt.logouturl,
        certificate: evt.certificate,
        preload: evt.preload})
        console.log(evt)
  }
  increaseStep() {
      this.setState(state => ({
        progressStep: state.progressStep+1
      }));
  }
  decreaseStep() {
      this.setState(state => ({
        progressStep: state.progressStep-1
      }));
  }

  render() {
    return (
      <div className="bx--grid landing-page">
        <div className="bx--row landing-page__breadcrumb">
          <div className="bx--col-lg-12">
            <Breadcrumb aria-label="Page navigation">
              <BreadcrumbItem>
                <a href="/">Back to home</a>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
        <div className="bx--row landing-page__banner">
          <div className="bx--col-lg-8 bx--col-md-2">
            <h1 className="landing-page__heading">
              Configuration
            </h1>
          </div>
          <div className="bx--col-lg-4 bx--col-md-6">
            { this.state.progressStep == 0 ? (
              <div className="button-parent">
                {(this.state.loginurl != '' && this.state.logouturl != '' && this.state.certificate != '') ? (
                  <Button kind="primary" className="button-group" onClick={this.increaseStep}>Next</Button>
                ) : (
                  <Button kind="primary" disabled={true} className="button-group">Next</Button>
                )}
              </div>
            ) : [
              (this.state.progressStep == 1 ?
                <div className="button-parent">
                  <Button kind="secondary" className="button-group" onClick={this.decreaseStep}>Back</Button>
                  <Button kind="primary" className="button-group" onClick={this.increaseStep}>Save</Button>
                </div>
               :
               <div className="button-parent">
                  <Button kind="secondary" className="button-group" onClick={this.decreaseStep}>Back</Button>
                </div>
              )
            ]
            }
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-8">
            <SetupProgress step={this.state.progressStep} />
          </div>
        </div>
        <div>
            { this.state.progressStep == 0 ? <FirstStep func={this.output} preload={this.preload} /> : null }
            { this.state.progressStep == 1 ? <SecondStep /> : null }
            { this.state.progressStep == 2 ? <ThirdStep params={this.state} /> : null }
        </div>

        <Footer text="Need help?" link="/" linktext="Visit the knowledge center" className="landing-page__r3" />
      </div>
    );
  }
}
export default Setup;

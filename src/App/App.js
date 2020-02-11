//imports
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Content } from 'carbon-components-react/lib/components/UIShell';
//styles
import './app.scss';
//Pages
import Header from './components/Header/Header';
import LandingPage from './pages/LandingPage/LandingPage';
import ViewProfile from './pages/ViewProfile/ViewProfile';
import Setup from './pages/Setup/Setup';
//Render
class App extends Component {
  render() {
    const App = () => (
        <Switch>
          <Route exact path='/' component={LandingPage}/>
          <Route path='/profile' component={ViewProfile}/>
          <Route path='/setup' component={Setup}/>
        </Switch>
    )
    return (
      <div>
        <Header />
        <Content className="bx__global-content">
          <Switch>
            <App />
          </Switch>
        </Content>
      </div>
    );
  }
}

export default App;

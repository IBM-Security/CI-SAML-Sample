import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App/App';

ReactDOM.hydrate((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Stuff
import { cookieControl } from './glTools';
import links from './links';

// Pages
import Home from './assets/home';

// Redux
import { Provider } from 'react-redux';
import store from './redux';

// Router
import { Route } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';

ReactDOM.render(
    <Provider store={ store }>
        <BrowserRouter>
            <Switch>
                <Route path="/" component={ Home } />
            </Switch>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './libs/fontawesome';
import * as serviceWorker from './serviceWorker';

// Stuff
import { cookieControl } from './glTools';
import links from './links';

// Pages
import Nav from './assets/navigation';
import Home from './assets/home';

// Redux
import { Provider } from 'react-redux';
import store from './redux';

// Router
import { Route } from 'react-router';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

ReactDOM.render(
    <Provider store={ store }>
        <BrowserRouter>
            <React.Fragment>
                <Nav />
                <Switch>
                    <Route path={ links["HOME_PAGE"].route } exact component={ Home } />
                    <Redirect from="/" exact to={ links["HOME_PAGE"].route } />
                </Switch>
            </React.Fragment>
        </BrowserRouter>
    </Provider>, document.querySelector('#app'));
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './libs/fontawesome';
import * as serviceWorker from './serviceWorker';

// Pages
import Nav from './assets/navigation';
import Home from './assets/home';
import Register from './assets/register';
import Search from "./assets/search";

// Redux
import { Provider } from 'react-redux';
import store from './redux';

// Router
import { Route } from 'react-router';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

// Stuff
import { cookieControl } from './glTools';
import links from './links';

const NeedleRoute = ({ path, condition, component: Component, redirect, ...settings }) => {
    return(
        <Route
            path={ path }
            { ...settings }
            component={props => {
                if(condition) {
                    return <Component { ...props } />
                } else {
                    return <Redirect to={ redirect } />
                }
            }}
        />
    );
}

// Render
ReactDOM.render(
    <Provider store={ store }>
        <BrowserRouter>
            <React.Fragment>
                {
                    (cookieControl.get("userdata")) ? (
                        <Nav />
                    ) : null
                }
                <Switch>
                    <NeedleRoute
                        path={ links["HOME_PAGE"].route }
                        condition={ cookieControl.get("userdata") }
                        component={ Home }
                        redirect={ links["REGISTER_PAGE"].route }
                        exact
                    />
                    <NeedleRoute
                        path={ links["SEARCH_PAGE"].route }
                        condition={ cookieControl.get("userdata") }
                        component={ Search }
                        redirect={ links["REGISTER_PAGE"].route }
                        exact
                    />
                    <NeedleRoute
                        path={ links["REGISTER_PAGE"].route }
                        condition={ !cookieControl.get("userdata") }
                        component={ Register }
                        redirect={ links["HOME_PAGE"].route }
                        exact
                    />
                    <Redirect from="/" exact to={ links["HOME_PAGE"].route } />
                </Switch>
            </React.Fragment>
        </BrowserRouter>
    </Provider>, document.querySelector('#app'));
serviceWorker.unregister();

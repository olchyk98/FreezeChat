import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';

import links from '../../links';
import client from '../../apollo';
import { cookieControl } from '../../glTools';
import apiPath from '../../api';

const Button = ({ icon, title, active, url, action }) => (url) ? (
    <Link to={ url } className={ `gl-nav-mat-btn definp${ (!active) ? "" : " active" }` }>
        { icon }
        <span>{ title }</span>
    </Link>
) : (action) ? (
    <button className="gl-nav-mat-btn definp" onClick={ action }>
        { icon }
        <span>{ title }</span>
    </button>
) : null

class App extends Component {
    componentDidMount() {
        let { id, authToken } = cookieControl.get("userdata");
        client.query({
            query: gql`
                query($id: ID!, $authToken: String!) {
                    user(id: $id, authToken: $authToken) {
                        id,
                        name,
                        avatar,
                        status
                    }
                }
            `,
            variables: {
                id, authToken
            }
        }).then(({ data: { user } }) => {
            if(!user) return this.props.failSession();

            this.props.updateSession(user);
        }).catch(this.props.failSession);
    }

    logout = () => {
        cookieControl.delete("userdata");
        window.location.href = links["REGISTER_PAGE"].absolute;
    }

    handleClick = () => { // XXX
        this.forceUpdate();
    }

    render() {
        return(
            <div className="gl-nav" onClick={ this.handleClick }>
                <div className="gl-nav-ac">
                    <div className="gl-nav-ac-avatar">
                        <div className={ 'gl-nav-ac-avatar-status ' + ((this.props.user.status && this.props.user.status.toLowerCase()) || "") } />
                        <img src={ (this.props.user.avatar) ? apiPath.storage + this.props.user.avatar : "" } alt="" />
                    </div>
                    <div className="gl-nav-ac-name">
                        <span className="gl-nav-ac-name-mat">{ this.props.user.name || "" }</span>
                    </div>
                </div>
                <div className="gl-nav-mat">
                    {
                        [
                            {
                                icon: <i className="fas fa-home" />,
                                title: "Home",
                                url: links["HOME_PAGE"] && links["HOME_PAGE"].absolute
                            },
                            {
                                icon: <i className="fas fa-search" />,
                                title: "Search",
                                url: links["SEARCH_PAGE"] && links["SEARCH_PAGE"].absolute
                            },
                            {
                                icon: <i className="fas fa-cogs" />,
                                title: "Settings",
                                url: links["SETTINGS_PAGE"] && links["SETTINGS_PAGE"].absolute
                            },
                            {
                                icon: <i className="fas fa-door-closed" />,
                                title: "Logout",
                                action: this.logout
                            }
                        ].map(({ icon, title, url, action }, index) => (
                            <Button
                                key={ index }
                                icon={ icon }
                                title={ title }
                                url={ url }
                                action={ action }
                                active={ "/"+window.location.pathname.split("/")[1] === url }
                            />
                        ))
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => ({
    user
})

const mapActionsToProps = {
    failSession: () => ({ type: "UPDATE_ERROR_STATE", payload: true }),
    updateSession: payload => ({ type: "SET_SESSION_DATA", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(App);
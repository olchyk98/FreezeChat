import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import links from '../../links';
import client from '../../apollo';
import { cookieControl } from '../../glTools';
import apiPath from '../../api';

const Button = ({ icon, title }) => (
    <button className="gl-nav-mat-btn definp">
        { icon }
        <span>{ title }</span>
    </button>
)

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

    render() {
        return(
            <div className="gl-nav">
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
                                title: "Logout"
                            }
                        ].map(({ icon, title, url }, index) => (
                            <Button
                                key={ index }
                                icon={ icon }
                                title={ title }
                                active={ window.location.pathname.split("/")[1] === url }
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
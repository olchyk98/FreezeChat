import React, { Component } from 'react';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../apollo';
import { cookieControl } from '../../glTools';

const NavigationStatusbtn = ({ title, _onClick }) => (
    <button
        className="rn-home-nav-action-statuslist-btn definp"
        onClick={ () => _onClick(title) }>
        { title }
    </button>
)

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statusNav: false
        }
    }

    submitStatus = status => {
        if(this.props.userStatus === status) return;

        this.props.updateSession({ status });
        
        let { id, authToken } = cookieControl.get("userdata");
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $authToken: String!, $status: String!) {
                    setUserStatus(id: $id, authToken: $authToken, status: $status) {
                        id
                    }
                } 
            `,
            variables: { id, authToken, status }
        }).then(({ data: { setUserStatus: user } }) => {
            if(!user) return this.props.failSession();
        }).catch(this.props.failSession);
    }

    render() {
        return(
            <React.Fragment>
                <div
                    className={ `rn-home-nav-action-statuslistbg${ (!this.state.statusNav) ? "" : " visible" }` }
                    onClick={ () => this.setState({ statusNav: false }) }
                />
                <div className="rn-home-nav">
                    <div />
                    <div className="rn-home-nav-action">
                        <div className="rn-home-nav-action-status">
                            <div
                                className="rn-home-nav-action-status-mat"
                                onClick={ () => this.setState({ statusNav: true }) }>
                                <span>Status: { this.props.userStatus || "..." }</span>
                                <i className="fas fa-sort-down" />
                            </div>
                            <div className={ `rn-home-nav-action-statuslist${ (!this.state.statusNav) ? "" : " visible" }` }>
                                <NavigationStatusbtn
                                    title="Free"
                                    _onClick={ this.submitStatus }
                                />
                                <NavigationStatusbtn
                                    title="Working"
                                    _onClick={ this.submitStatus }
                                />
                                <NavigationStatusbtn
                                    title="Busy"
                                    _onClick={ this.submitStatus }
                                />
                                <NavigationStatusbtn
                                    title="Sale"
                                    _onClick={ this.submitStatus }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ user: { status: userStatus } }) => ({
    userStatus
});

const mapActionsToProps = {
    failSession: () => ({ type: "UPDATE_ERROR_STATE", payload: true }),
    updateSession: payload => ({ type: "SET_SESSION_DATA", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(Navigation);
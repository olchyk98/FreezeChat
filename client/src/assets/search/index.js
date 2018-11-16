import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';
// import { connect } from 'react-redux';

import client from '../../apollo';
import { cookieControl } from '../../glTools';
import apiPath from '../../api';
import links from '../../links';

class Field extends Component {
    constructor(props) {
        super(props);

        this.submitInt = null;
    }

    handleChange = value => {
        clearTimeout(this.submitInt);
        this.submitInt = setTimeout(() => {
            this.submitInt = null;
            this.props.onSearch(value);
        }, 350);

    }

    render() {
        return(
            <div className="rn-search-mat">
                <div className="rn-search-mat-icon">
                    <i className="fas fa-search" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="rn-search-mat-field definp"
                    onChange={ ({ target: { value } }) => this.handleChange(value) }
                />
            </div>
        );
    }
}

const ResultsUser = ({ avatar, name, status, onChoose }) => (
    <div className="rn-search-results-user">
        <div className="rn-search-results-user-selector" onClick={ onChoose } />
        <div className="rn-search-results-user-avatar">
            <div className={ `rn-search-results-user-avatar-status glc-userstatus ${ (status && status.toLowerCase()) || "" }` } />
            <img src={ (avatar && apiPath.storage + avatar) || "" } alt={ name } />
        </div>
        <p className="rn-search-results-user-name">{ name }</p>
        <button className="rn-search-results-user-chat definp" onClick={ onChoose }>
            <i className="fas fa-envelope" />
        </button>
    </div>
)

class Results extends Component {
    render() {
        if(this.props.data === false) return( // loading
            <div className="rn-search-results">
                <div className="rn-search-results-loader" />
            </div>
        );

        return(
            <div className="rn-search-results">
                {
                    (this.props.data) ? (
                        (this.props.data.length) ? (
                            this.props.data.map(({ id, name, avatar, status }) => (
                                <ResultsUser
                                    key={ id }
                                    name={ name }
                                    avatar={ avatar }
                                    status={ status }
                                    onChoose={ () => this.props.onChooseConversation(id) }
                                />
                            ))
                        ) : (
                            <p className="rn-search-results-alertion">Nothing here :(</p>
                        )
                    ) : (
                        <p className="rn-search-results-alertion">Start typing your query</p>
                    )
                }
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            affect: false,
            results: null
        }
    }

    handleSearch = query => {
        if(!query.replace(/ /g, "").length) {
            if(this.state.results === null) return;
            else return this.setState(() => ({
                results: null
            }));
        }

        this.setState(() => ({
            results: false
        }));

        let { id, authToken } = cookieControl.get("userdata");
        client.query({
            query: gql`
                query($id: ID!, $authToken: String!, $query: String!) {
                    searchUsers(id: $id, authToken: $authToken, query: $query) {
                        id,
                        name,
                        avatar,
                        status
                    }
                }
            `,
            variables: { id, authToken, query }
        }).then(({ data: { searchUsers: users } }) => {
            this.setState(() => ({
                results: users
            }));
        }).catch(this.props.failSession);
    }

    loadConversation = victimid => {
        return this.props.history.push(`${ links["HOME_PAGE"].absolute }/${ victimid }`);
    }

    render() {
        return(
            <div className="rn rn-search">
                <Field
                    onSearch={ this.handleSearch }
                />
                <Results
                    data={ this.state.results }
                    onChooseConversation={ this.loadConversation }
                />
            </div>
        );
    }
}

export default App;
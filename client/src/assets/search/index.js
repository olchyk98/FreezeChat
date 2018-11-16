import React, { Component } from 'react';
import './main.css';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/ff856e07ea460c98398c8946bb1a4d49/5C7CF59A/t51.2885-19/s150x150/22857890_124130168253953_9110071387996815360_n.jpg";

class Field extends Component {
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
                />
            </div>
        );
    }
}

class ResultsUser extends Component {
    render() {
        return(
            <div className="rn-search-results-user">
                <div className="rn-search-results-user-avatar">
                    <img src={ image } alt="" />
                </div>
                <p className="rn-search-results-user-name">Oles Odynets</p>
                <button className="rn-search-results-user-chat definp">
                    <i className="fas fa-envelope" />
                </button>
            </div>
        );
    }
}

class Results extends Component {
    render() {
        return(
            <div className="rn-search-results">
                <ResultsUser />
                <ResultsUser />
                <ResultsUser />
                <ResultsUser />
                <ResultsUser />
                <ResultsUser />
            </div>
        );
    }
}

class App extends Component {
    render() {
        return(
            <div className="rn rn-search">
                <Field />
                <Results />
            </div>
        );
    }
}

export default App;
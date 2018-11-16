import React, { Component } from 'react';

import apiPath from '../../api';
import { convertTime } from '../../glTools';

class DisplayConversationsListConversation extends Component {
    constructor(props) {
        super(props);

        this._isMount = this.updateInt = null;
    }
    
    componentDidMount() {
        this._isMount = true;
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    componentDidUpdate() {
        this.updateInt = setInterval(() => (this._isMount) ? this.forceUpdate() : null, 5000); // NOTE: You should use arrow function!
    }
    
    render() {
        return(
            <div className={ `rn-home-display-conversations-list-conv${ (!this.props.active) ? "" : " active" }` }>
                <div className="rn-home-display-conversations-list-conv-selector"
                    onClick={ this.props.onRequest }
                />
                <div className="rn-home-display-conversations-list-conv-main">
                    <div className="rn-home-display-conversations-list-conv-main-avatar">
                        <img src={ (this.props.image) ? apiPath.storage + this.props.image : "" } alt="" />
                    </div>
                    <div className="rn-home-display-conversations-list-conv-main-name">
                        <p className="rn-home-display-conversations-list-conv-main-name-mat">
                            { this.props.name }
                        </p>
                        <p className="rn-home-display-conversations-list-conv-main-name-preview">
                            { this.props.content }
                        </p>
                    </div>
                </div>
                <div className="rn-home-display-conversations-list-conv-info">
                    <span className="rn-home-display-conversations-list-conv-info">{ convertTime(this.props.time, "ago") }</span>
                    {
                        (parseInt(this.props.unSeenMessages)) ? (
                            <span className="rn-home-display-conversations-list-conv-counter">{ this.props.unSeenMessages }</span>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

export default DisplayConversationsListConversation;
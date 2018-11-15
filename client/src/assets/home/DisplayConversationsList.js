import React, { Component } from 'react';

import { connect } from 'react-redux';

import DisplayConversationsListConversation from './DisplayConversationsListConversation';

class DisplayConversationsList extends Component {
    render() {
        if(this.props.conversations === false || this.props.findedConversations === false) return( // loading
            <div className="rn-home-display-conversations-list">
                <div className="rn-home-display-conversations-list-loader" />
            </div>
        );

        return(
            <div className="rn-home-display-conversations-list">
                {
                    (this.props.findedConversations || this.props.conversations) ? (
                        ( (this.props.findedConversations) ? this.props.findedConversations.length : (this.props.conversations) ? this.props.conversations.length : null ) ? (
                            (this.props.findedConversations || this.props.conversations).map(({ id, previewTitle, previewImage, previewContent, unSeenMessages, previewTime }) => (
                                <DisplayConversationsListConversation
                                    key={ id }
                                    name={ previewTitle }
                                    image={ previewImage }
                                    time={ previewTime }
                                    unSeenMessages={ unSeenMessages }
                                    content={ previewContent }
                                    onRequest={ () => this.props.onRequestConversation(id) }
                                    active={ this.props.activeConversation === id }
                                />
                            ))
                        ) : (
                            <p className="rn-home-display-conversations-list-alertion">Nothing here :(</p>
                        )
                    ) : null
                }
            </div>
        );
    }
}

const mapStateToProps = ({ user: { conversations } }) => ({
    conversations
});

export default connect(
    mapStateToProps
)(DisplayConversationsList);
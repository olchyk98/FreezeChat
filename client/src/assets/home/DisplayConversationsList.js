import React, { Component } from 'react';

import { connect } from 'react-redux';

import DisplayConversationsListConversation from './DisplayConversationsListConversation';

class DisplayConversationsList extends Component {
    render() {
        if(this.props.conversations === false) return( // loading
            <div className="rn-home-display-conversations-list">
                <div className="rn-home-display-conversations-list-loader" />
            </div>
        );

        return(
            <div className="rn-home-display-conversations-list">
                {
                    (this.props.conversations) ? (
                        this.props.conversations.map(({ id, previewTitle, previewImage, previewContent, unSeenMessages, previewTime }) => (
                            <DisplayConversationsListConversation
                                key={ id }
                                name={ previewTitle }
                                image={ previewImage }
                                time={ previewTime }
                                unSeenMessages={ unSeenMessages }
                                content={ previewContent }
                                onRequest={ () => this.props.onRequestConversation(id) }
                            />
                        ))
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
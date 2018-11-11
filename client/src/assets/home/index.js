import React, { Component } from 'react';
import './main.css';

const stickers = {
    "HEART_STICER": "https://www.facebook.com/images/emoji.php/v9/f92/1/128/2764.png"
}

const image = "https://scontent-arn2-1.cdninstagram.com/vp/ece02e9760259dc0d04dcaf6fe693e0e/5C6F03FD/t51.2885-19/s150x150/37628995_765658007113147_8807396603036958720_n.jpg";

const NavigationStatusbtn = ({ title, _onClick }) => (
    <button
        className="rn-home-nav-action-statuslist-btn definp"
        onClick={ _onClick }>
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
                                <span>Status: Ring</span>
                                <i className="fas fa-sort-down" />
                            </div>
                            <div className={ `rn-home-nav-action-statuslist${ (!this.state.statusNav) ? "" : " visible" }` }>
                                <NavigationStatusbtn
                                    title="Free"
                                    _onClick={ () => null }
                                />
                                <NavigationStatusbtn
                                    title="Working"
                                    _onClick={ () => null }
                                />
                                <NavigationStatusbtn
                                    title="Busy"
                                    _onClick={ () => null }
                                />
                                <NavigationStatusbtn
                                    title="Sale"
                                    _onClick={ () => null }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class DisplayConversationsSearch extends Component {
    render() {
        return(
            <div className="rn-home-display-conversations-search">
                <div className="rn-home-display-conversations-search-icon">
                    <i className="fas fa-search" />
                </div>
                <input
                    type="text"
                    className="rn-home-display-conversations-search-input definp"
                    placeholder="Search"
                />
            </div>
        );
    }
}

class DisplayConversationsListConversation extends Component {
    render() {
        return(
            <div className="rn-home-display-conversations-list-conv">
                <div className="rn-home-display-conversations-list-conv-main">
                    <div className="rn-home-display-conversations-list-conv-main-avatar">
                        <img src={ image } alt="" />
                    </div>
                    <div className="rn-home-display-conversations-list-conv-main-name">
                        <p className="rn-home-display-conversations-list-conv-main-name-mat">
                            Oles Odynets
                        </p>
                        <p className="rn-home-display-conversations-list-conv-main-name-preview">
                            Sure hel
                        </p>
                    </div>
                </div>
                <div className="rn-home-display-conversations-list-conv-info">
                    <span className="rn-home-display-conversations-list-conv-info">02 Feb</span>
                    <span className="rn-home-display-conversations-list-conv-counter">3</span>
                </div>
            </div>
        );
    }
}

class DisplayConversationsList extends Component {
    render() {
        return(
            <div className="rn-home-display-conversations-list">
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
                <DisplayConversationsListConversation />
            </div>
        );
    }
}

class DisplayConversations extends Component {
    render() {
        return(
            <div className="rn-home-display-conversations">
                <DisplayConversationsSearch />
                <DisplayConversationsList />
            </div>
        );
    }
}

const DisplayChatDisplayMessage = ({ clients }) => (
    <div className={ `rn-home-display-chat-display-message${ (!clients) ? "" : " right" }` }>
        <div className="rn-home-display-chat-display-message-content">
            <div className="rn-home-display-chat-display-message-content-avatar">
                <img src={ image } alt="" />
            </div>
            <div className="rn-home-display-chat-display-message-content-mat">
                <span className="rn-home-display-chat-display-message-content-mat-text">
                    Hello, World!
                </span>
            </div>
        </div>
        <div className="rn-home-display-chat-display-message-time">
            <span>23:32</span>
        </div>
    </div>
)

class DisplayChatDisplay extends Component {
    render() {
        return(
            <div className="rn-home-display-chat-display">
                <DisplayChatDisplayMessage
                    clients={ false }
                /> 
                <DisplayChatDisplayMessage
                    clients={ true }
                /> 
            </div>
        );
    }
}

class DisplayChatInputAction extends Component {
    render() {
        return(
            <span className="rn-home-display-chat-input-actions-action">Submit offer</span>
        );
    }
}

class DisplayChatInput extends Component {
    render() {
        return(
            <div className="rn-home-display-chat-input">
                <div className="rn-home-display-chat-input-actions">
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                    <DisplayChatInputAction />
                </div>
                <div className="rn-home-display-chat-input-mat">
                    <div className="rn-home-display-chat-input-mat-btn">
                        <div className="rn-home-display-chat-input-mat-btn-display">
                            {
                                Object.keys(stickers).map((session, index) => (
                                    <img
                                        key={ index }
                                        alt="chat sticker display"
                                        className="rn-home-display-chat-input-mat-btn-display-btn"
                                        src={ stickers[session] }
                                    />
                                ))
                            }
                        </div>
                        <button className="definp"><i className="far fa-sticky-note" /></button>
                    </div>
                    <input
                        type="text"
                        className="rn-home-display-chat-input-mat-input definp"
                        placeholder="Type a message.."
                    />
                    <div className="rn-home-display-chat-input-mat-send">
                        <button className="definp">
                            <i className="far fa-paper-plane" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

class DisplayChat extends Component {
    render() {
        return(
            <div className="rn-home-display-chat">
                <div className="rn-home-display-chat-name">
                    <h2 className="rn-home-display-chat-name-mat">Oles Odynets</h2>
                </div>
                <DisplayChatDisplay />
                <DisplayChatInput />
            </div>
        );
    }
}

class Display extends Component {
    render() {
        return(
            <div className="rn-home-display">
                <DisplayConversations />
                <DisplayChat />
            </div>
        );
    }
}

class App extends Component {
    render() {
        return(
            <div className="rn rn-home">
                <Navigation />
                <Display />
            </div>
        );
    }
}

export default App;
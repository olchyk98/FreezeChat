import React, { Component } from 'react';
import './main.css';

import links from '../../links';

const image = "https://scontent-arn2-1.cdninstagram.com/vp/ece02e9760259dc0d04dcaf6fe693e0e/5C6F03FD/t51.2885-19/s150x150/37628995_765658007113147_8807396603036958720_n.jpg";

const Button = ({ icon, title }) => (
    <button className="gl-nav-mat-btn definp">
        { icon }
        <span>{ title }</span>
    </button>
)

class App extends Component {
    render() {
        return(
            <div className="gl-nav">
                <div className="gl-nav-ac">
                    <div className="gl-nav-ac-avatar">
                        <img src={ image } alt="" />
                    </div>
                    <div className="gl-nav-ac-name">
                        <span className="gl-nav-ac-name-mat">Oles Odynets</span>
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

export default App;
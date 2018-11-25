import React, { Component } from 'react';
import './main.css';

const image = "http://localhost:4000/files/avatars/DYrlDOWy7WtZdRBd2okSpATK8fOp16qZquC4FUBL9rblOTdMlNBiiOka3wM3LblVCQOruix12mbtNpUxuZtGr2obPn3UauHQLmeEJU7H3MXDaJOGYmv3VtRa4ArN9ylx.png";

class NavButton extends Component {
    render() {
        return(
            <div className={ `rn-settings-nav-btn${ (!this.props.active) ? "" : " active"  }` } onClick={ this.props._onClick }>
                <div className="rn-settings-nav-btn-icon">
                    { this.props.icon }
                </div>
                <div className="rn-settings-nav-btn-info">
                    <p className="rn-settings-nav-btn-info-text rn-settings-nav-btn-info-title">
                        { this.props.title }
                    </p>
                    <p className="rn-settings-nav-btn-info-text rn-settings-nav-btn-info-desc">
                        { this.props.desc }
                    </p>
                </div>
            </div>
        );
    }
}

class Display extends Component {
    render() {
        return(
            <div className={ `rn-settings-mat-display${ (!this.props.visible) ? "" : " visible" }` }>
                <div className="rn-settings-mat-display-title">
                    <span>{ this.props.title }</span>
                </div>
                <div className="rn-settings-mat-display-mat">
                    { this.props.children }
                </div>
                <div className="rn-settings-mat-display-submitor">
                    <button className="rn-settings-mat-display-submitor-btn">
                        Save changes
                    </button>
                </div>
            </div>
        );
    }
}

class Input extends Component {
    render() {
        return(
            <div className="rn-settings-ASSETS-input">
                <div className="rn-settings-ASSETS-input-icon">
                    { this.props.icon }
                </div>
                <input
                    className="rn-settings-ASSETS-input-mat definp"
                    type={ this.props._type }
                    placeholder={ this.props._placeholder }
                />
            </div>
        );
    }
}

class App extends Component {
    render() {
        return(
            <div className="rn rn-settings">
                <div className="rn-settings-nav">
                    {
                        [
                            {
                                icon: <i className="far fa-user" />,
                                title: "Account settings",
                                desc: "Settings for your account"
                            },
                            {
                                icon: <i className="fas fa-object-group" />,
                                title: "App settings",
                                desc: "Settings for application design"
                            }
                        ].map(({ icon, title, desc }, index) => (
                            <NavButton
                                key={ index }
                                icon={ icon }
                                title={ title }
                                desc={ desc }
                                _onClick={ () => null }
                            />
                        ))
                    }
                </div>
                <div className="rn-settings-mat">
                    <Display title="Account" visible={ true }>
                        <div className="rn-settings-mat-display-mat-settings-avatar">
                            <div className="rn-settings-mat-display-mat-settings-avatar-mat">
                                <img
                                    src={ image }
                                    alt="set"
                                />
                            </div>
                            <input type="file" className="hidden" id="rn-settings-mat-display-mat-settings-avatar-file" />
                            <label htmlFor="rn-settings-mat-display-mat-settings-avatar-file" className="rn-settings-mat-display-mat-settings-avatar-file">
                                Upload new image
                            </label>
                            <button className="rn-settings-mat-display-mat-settings-avatar-remove definp">Remove</button>
                        </div>
                        <div className="rn-settings-mat-display-mat-form">
                            {
                                [
                                    {
                                        type: "text",
                                        placeholder: "Name",
                                        icon: <i className="far fa-user" />
                                    },
                                    {
                                        type: "password",
                                        placeholder: "Password",
                                        icon: <i className="fas fa-star-of-life" />
                                    }
                                ].map(({ type, placeholder, icon }, index) => (
                                    <Input
                                        _type={ type }
                                        _placeholder={ placeholder }
                                        icon={ icon }
                                    />
                                ))
                            }
                        </div>
                    </Display>
                </div>
            </div>
        );
    }
}

export default App;
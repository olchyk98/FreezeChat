import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';

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
    constructor(props) {
        super(props);

        this.matRef = React.createRef();
    }

    // -------------------- //
    componentDidMount(a) {
        if(!a || this.props._defaultValue !== a._defaultValue) {
            this.matRef.value = this.props._defaultValue;
        }
    }

    componentDidUpdate(a) {
        if(this.props._defaultValue !== a._defaultValue) {
            this.matRef.value = this.props._defaultValue;
        }
    }
    // -------------------- //

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
                    onChange={ ({ target: { value } }) => this.props._onChange(value) }
                    ref={ ref => this.matRef = ref }
                />
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stage: 'NO_STAGE',
            data: {
                account: {
                    name: "",
                    password: "",
                    repassword: ""
                }
            }
        }
    }

    componentDidUpdate(a) {
        let b = b => ((Object.keys(b).length) ? true:false);
        if(!b(a.user) && b(this.props.user)) {
            this.setState(({ data }) => ({
                data: {
                    ...data,
                    account: {
                        name: this.props.user.name,
                        password: ""
                    }
                }
            }));
        }
    }

    setValData = (field, value) => {
        if(field === "password" && !value.replace(/\*/g, "").length) return;

        this.setState(({ data, data: { account } }) => ({
            data: {
                ...data,
                account: {
                    ...account,
                    [field]: value
                }
            }
        }));
    }

    render() {
        return(
            <div className="rn rn-settings">
                <div className="rn-settings-nav">
                    {
                        [
                            {
                                icon: <i className="far fa-user" />,
                                title: "Account settings",
                                desc: "Settings for your account",
                                stage: "ACCOUNT_STAGE"
                            },
                            {
                                icon: <i className="fas fa-object-group" />,
                                title: "App settings",
                                desc: "Settings for application",
                                stage: "APP_STAGE"
                            }
                        ].map(({ icon, title, desc, stage }, index) => (
                            <NavButton
                                key={ index }
                                icon={ icon }
                                title={ title }
                                desc={ desc }
                                active={ this.state.stage === stage }
                                _onClick={ () => this.setState({ stage }) }
                            />
                        ))
                    }
                </div>
                <div className="rn-settings-mat">
                    {
                        (this.state.stage === "NO_STAGE") ? (
                            <span className="rn-settings-nav-alertion">
                                Open a tab for see your settings
                            </span>
                        ) : null
                    }
                    <Display title="Account" visible={ this.state.stage === "ACCOUNT_STAGE" }>
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
                                        field: "name",
                                        icon: <i className="far fa-user" />
                                    },
                                    {
                                        type: "password",
                                        placeholder: "Password",
                                        field: "password",
                                        icon: <i className="fas fa-star-of-life" />
                                    },
                                    {
                                        type: "password",
                                        placeholder: "Repeat your new pass",
                                        field: "repassword",
                                        icon: <i className="fas fa-star-of-life" />
                                    }
                                ].map(({ type, placeholder, icon, field }, index) => (
                                    <Input
                                        key={ index }
                                        _type={ type }
                                        _placeholder={ placeholder }
                                        icon={ icon }
                                        _defaultValue={({
                                            password: "*******",
                                            name: (this.state.data.account.name || "")
                                        }[field]) || ""}
                                        _onChange={ value => this.setValData(field, value) }
                                    />
                                ))
                            }
                        </div>
                    </Display>
                    <Display title="Application" visible={ this.state.stage === "APP_STAGE" }>

                    </Display>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => ({
    user
});

export default connect(
    mapStateToProps
)(App);
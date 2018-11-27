import React, { Component } from 'react';
import './main.css';

import { connect } from 'react-redux';
import { gql } from 'apollo-boost';

import client from '../../apollo';
import apiPath from '../../api';
import { cookieControl } from '../../glTools';

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
                    <button className="rn-settings-mat-display-submitor-btn" onClick={ this.props._onSubmit }>
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
            <div className={ `rn-settings-ASSETS-input${ (!this.props.error) ? "" : " error" }` }>
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
                    repassword: "",
                    avatar: "",
                    previewAvatar: null
                }
            },
            inError: []
        }
    }

    componentDidUpdate(a) {
        let b = b => ((Object.keys(b).length) ? true:false);
        if(!b(a.user) && b(this.props.user)) {
            this.setState(({ data, data: { account } }) => ({
                data: {
                    ...data,
                    account: {
                        ...account,
                        name: this.props.user.name
                    }
                }
            }));
        }
    }

    componentWillUnmount() {
        URL.revokeObjectURL(this.state.data.account.previewAvatar);
    }

    setValData = (stage, field, value) => {
        if(field === "password" && !value.replace(/\*/g, "").length) return;
        if(field === "avatar" && stage === "account") {
            URL.revokeObjectURL(this.state.data.account.previewAvatar);
            this.setState(({ data, data: { account } }) => ({
                data: {
                    ...data,
                    account: {
                        ...account,
                        avatar: value,
                        previewAvatar: URL.createObjectURL(value)
                    }
                }
            }));
            return;
        }

        this.setState(({ data }) => ({
            data: {
                ...data,
                [stage]: {
                    ...data[stage],
                    [field]: value
                }
            }
        }));
    }

    submitData = async () => {
        await this.setState(() => ({ inError: [] }));

        switch(this.state.stage) {
            case 'ACCOUNT_STAGE': {
                let { name, password, repassword, avatar } = this.state.data.account,
                    a = a => ((a.replace(/ /g, "").length) ? true:false),
                    b = false,
                    c = (...c) => this.setState(({ inError }) => ({ inError: [...inError, ...c] }));

                if(!a(name)) {
                    b = true;
                    c("name");
                }
                if(password !== "" && (!a(password) || !a(repassword) || a(password) !== a(repassword))) {
                    b = true;
                    c("password", "repassword");
                }

                if(!b) { // submit
                    let { id, authToken } = cookieControl.get("userdata");
                    client.mutate({
                        mutation: gql`
                            mutation($id: ID!, $authToken: String!, $name: String, $password: String, $avatar: Upload) {
                                settingAccount(id: $id, authToken: $authToken, name: $name, password: $password, avatar: $avatar) {
                                    id,
                                    name,
                                    avatar
                                }
                            }
                        `,
                        variables: {
                            id, authToken,
                            name, password,
                            avatar
                        }
                    }).then(({ data: { settingAccount } }) => {
                        if(!settingAccount) return this.props.failSession();

                        let { avatar } = settingAccount;
                        this.props.updateSession({
                            name,
                            avatar
                        });
                    }).catch(this.props.failSession);
                }
            } break;
            default:break;
        }
    }

    deleteAvatar = () => {
        let { id, authToken } = cookieControl.get("userdata");
        client.mutate({
            mutation: gql`
                mutation($id: ID!, $authToken: String!) {
                    deleteAvatar(id: $id, authToken: $authToken) {
                        id,
                        avatar
                    }
                }
            `,
            variables: {
                id, authToken
            }
        }).then(({ data: { deleteAvatar } }) => {
            if(!deleteAvatar) return this.props.failSession();

            let { avatar } = deleteAvatar;
            this.props.updateSession({
                avatar
            });
        }).catch(console.log);
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
                                _onClick={ () => this.setState({ stage, inError: [] }) }
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
                    <Display title="Account" visible={ this.state.stage === "ACCOUNT_STAGE" } _onSubmit={ this.submitData }>
                        <div className="rn-settings-mat-display-mat-settings-avatar">
                            <div className="rn-settings-mat-display-mat-settings-avatar-mat">
                                <img
                                    src={ this.state.data.account.previewAvatar || apiPath.storage + this.props.user.avatar }
                                    alt="your avatar"
                                />
                            </div>
                            <input
                                type="file" className="hidden"
                                accept="image/*"
                                onChange={ ({ target: { files } }) => this.setValData("account", "avatar", files[0]) }
                                id="rn-settings-mat-display-mat-settings-avatar-file" />
                            <label htmlFor="rn-settings-mat-display-mat-settings-avatar-file" className="rn-settings-mat-display-mat-settings-avatar-file">
                                Upload new image
                            </label>
                            <button className="rn-settings-mat-display-mat-settings-avatar-remove definp" onClick={ this.deleteAvatar }>Remove</button>
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
                                        error={ this.state.inError.includes(field) }
                                        _defaultValue={({
                                            password: "*******",
                                            name: (this.state.data.account.name || "")
                                        }[field]) || ""}
                                        _onChange={ value => this.setValData("account", field, value) }
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

const mapActionsToProps = {
    failSession: () => ({ type: "UPDATE_ERROR_STATE", payload: true }),
    updateSession: payload => ({ type: "SET_SESSION_DATA", payload })
}

export default connect(
    mapStateToProps,
    mapActionsToProps
)(App);
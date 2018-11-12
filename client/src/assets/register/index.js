import React, { Component } from 'react';
import './main.css';

import { gql } from 'apollo-boost';

import client from '../../apollo';
import { cookieControl } from '../../glTools';
import links from '../../links';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filled: false,
            inFocus: false
        }

        this.matRef = React.createRef();
    }
    
    validate = value => {
        if(value && this.state.filled !== ((value.toString()) ? true:false)) {
            this.setState(({ filled }) => ({
                filled: !filled
            }));
        }
    }

    render() {
        return(
            <div className={ `op-register-mat-form-input${ (!this.state.inFocus) ? "" : " infocus" }` }>
                <input
                    type={ this.props._type }
                    className={ `op-register-mat-form-input-mat definp${ (!this.state.filled) ? "" : " filled" }` }
                    onFocus={ () => this.setState({ inFocus: true }) }
                    onBlur={ () => this.setState({ inFocus: false }) }
                    onChange={ ({ target: { value } }) => { this.props._onChange(value); this.validate(value); } }
                    required={ this.props._required }
                />
                <span className="op-register-mat-form-input-placeholder">{ this.props._placeholder }</span>
            </div>
        );
    }
}

class Upload extends Component {
    render() {
        return(
            <React.Fragment>
                <input
                    type="file"
                    className="hidden"
                    id={ this.props._id }
                    onChange={ ({ target: { files } }) => (files[0]) ? this.props.onUpload(files[0]) : null }
                />
                <label tabIndex="0" className="op-register-mat-form-upfile" htmlFor={ this.props._id }>{ this.props.title }</label>
            </React.Fragment>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                login: {
                    login: "",
                    password: ""
                },
                register: {
                    login: "",
                    password: "",
                    repPassword: "",
                    name: "",
                    avatar: ""
                }
            },
            error: "",
            stage: "LOGIN_STAGE"
        }
    }

    register = event => {
        event.preventDefault();
        
        let { login, password, repPassword, name, avatar } = this.state.data.register;

        if(password !== repPassword) return this.setState(() => ({
            error: "Passwords in not equal!"
        }));

        this.setState(() => ({
            error: ""
        }));

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!, $name: String!, $avatar: Upload!) {
                    registerUser(login: $login, password: $password, name: $name, avatar: $avatar) {
                        id,
                        lastAuthToken
                    }
                }
            `,
            variables: {
                login, password,
                name,
                avatar: avatar || ""
            }
        }).then(({ data: { registerUser: data } }) => {
            if(!data) return this.setState(() => ({
                error: "User with this login or password already exists!"
            }));

            cookieControl.set("userdata", {
                id: data.id,
                authToken: data.lastAuthToken
            });

            window.location.href = links["HOME_PAGE"].absolute;
        }).catch(console.err);
    }

    setValue = (stage, field, value) => {
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

    getToggleStage = () => ({
        "LOGIN_STAGE": "Register",
        "REGISTER_STAGE": "Login"
    }[this.state.stage]);

    toggleStage = () => this.setState(({ stage }) => ({
        error: "",
        stage: {
            "LOGIN_STAGE": "REGISTER_STAGE",
            "REGISTER_STAGE": "LOGIN_STAGE"
        }[stage]
    }));

    login = event => {
        event.preventDefault();

        let { login, password } = this.state.data.login;

        client.mutate({
            mutation: gql`
                mutation($login: String!, $password: String!) {
                    loginUser(login: $login, password: $password) {
                        id,
                        lastAuthToken
                    }
                } 
            `,
            variables: { login, password }
        }).then(({ data: { loginUser } }) => {
            if(!loginUser) return this.setState(() => ({
                error: "User with this login and password is not exists"
            }));

            cookieControl.set("userdata", {
                id: loginUser.id,
                authToken: loginUser.lastAuthToken
            });

            window.location.href = links["HOME_PAGE"].absolute;
        }).catch(console.err);
    }

    render() {
        return(
            <div className="op-register">
                <div className="op-register-mat">
                    <button className="op-register-mat-toggstage definp" onClick={ this.toggleStage }>{ this.getToggleStage() }</button>
                    <form className={ `op-register-mat-loginform op-register-mat-form${ (this.state.stage !== "LOGIN_STAGE") ? "" : " visible" }` } onSubmit={ this.login }>
                        <h1 className="op-register-mat-form-title">Login</h1>
                        {
                            (!this.state.error) ? null : (
                                <p className="op-register-mat-form-err">{ this.state.error || "error" }</p>
                            )
                        }
                        <Input
                                _placeholder="Login"
                                _type="text"
                                _onChange={ value => this.setValue("login", "login", value) }
                                _required={ true }
                            />
                            <Input
                                _placeholder="Password"
                                _type="password"
                                _onChange={ value => this.setValue("login", "password", value) }
                                _required={ true }
                            />
                        <button type="submit" className="op-register-mat-form-submit definp">Login</button>
                    </form>
                    <form className={ `op-register-mat-registerform op-register-mat-form${ (this.state.stage !== "REGISTER_STAGE") ? "" : " visible" }` } onSubmit={ this.register }>
                        <h1 className="op-register-mat-form-title">Register</h1>
                        {
                            (!this.state.error) ? null : (
                                <p className="op-register-mat-form-err">{ this.state.error || "error" }</p>
                            )
                        }
                        <div className="op-register-mat-form-line">
                            <Input
                                _placeholder="Login"
                                _type="text"
                                _onChange={ value => this.setValue("register", "login", value) }
                                _required={ true }
                            />
                            <Input
                                _placeholder="Name"
                                _type="text"
                                _onChange={ value => this.setValue("register", "name", value) }
                                _required={ true }
                            />
                        </div>
                        <div className="op-register-mat-form-line">
                            <Input
                                _placeholder="Password"
                                _type="password"
                                _onChange={ value => this.setValue("register", "password", value) }
                                _required={ true }
                            />
                            <Input
                                _placeholder="Repeat password"
                                _type="password"
                                _onChange={ value => this.setValue("register", "repPassword", value) }
                                _required={ true }
                            />
                        </div>
                        <Upload
                            _id="op-register-mat-registerform-avatar"
                            title="Avatar"
                            onUpload={ file => this.setValue("register", "avatar", file) }
                        />
                        <button type="submit" className="op-register-mat-form-submit definp">Register</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
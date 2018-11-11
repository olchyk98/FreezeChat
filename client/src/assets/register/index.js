import React, { Component } from 'react';
import './main.css';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inFocus: false
        }
    }

    render() {
        return(
            <div className={ `op-register-mat-form-input${ (!this.state.inFocus) ? "" : " infocus" }` }>
                <input
                    type={ this.props._type }
                    className="op-register-mat-form-input-mat definp"
                    onFocus={ () => this.setState({ inFocus: true }) }
                    onBlur={ () => this.setState({ inFocus: false }) }
                    onChange={ ({ target: { value } }) => this.props._onChange(value) }
                    required
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
                register: {
                    login: "",
                    password: "",
                    repPassword: "",
                    name: "",
                    file: ""
                }
            }
        }
    }

    render() {
        return(
            <div className="op-register">
                <div className="op-register-mat">
                    <form className="op-register-mat-registerform">
                        <h1 className="op-register-mat-form-title">Register</h1>
                        <div className="op-register-mat-form-line">
                            <Input
                                _placeholder="Login"
                                _type="text"
                                _onChange={ () => null }
                            />
                            <Input
                                _placeholder="Name"
                                _type="text"
                                _onChange={ () => null }
                            />
                        </div>
                        <div className="op-register-mat-form-line">
                            <Input
                                _placeholder="Password"
                                _type="password"
                                _onChange={ () => null }
                            />
                            <Input
                                _placeholder="Repeat password"
                                _type="password"
                                _onChange={ () => null }
                            />
                        </div>
                        <Upload
                            _id="op-register-mat-form-avatar"
                            title="Avatar"
                            onUpload={ file => null }
                        />
                        <button type="submit" className="op-register-mat-form-submit definp">Register</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
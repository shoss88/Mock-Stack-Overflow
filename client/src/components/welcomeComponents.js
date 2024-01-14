import React from 'react';
import axios from 'axios';

export class WelcomePage extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidUpdate() {
        let changePage = this.props.changePage;
        let dataModel = this.props.dataModel;
        axios.post('http://localhost:8000/welcome', {}, {withCredentials:true})
            .then((user) => {
                let userEmail = user.data;
                if (userEmail !== null){
                    let allUsers = dataModel.users;
                    let userObject = allUsers.find(user => user.email === userEmail);
                    if (userObject !== undefined){
                        changePage("Home", false, false, userObject);
                    }
                }
            });
    }

    render(){
        let changePage = this.props.changePage;
        return(
            <div id="welcome-page">
                <div id="welcome-wrapper">
                    <button className="welcome-button" onClick={() => changePage("Register")}>Register as New User</button>
                    <button className="welcome-button" onClick={() => changePage("Login")}>Login</button>
                    <button className="welcome-button" onClick={() => {
                        axios.post('http://localhost:8000/login/guest', {}, {withCredentials:true})
                        .then((res) => {
                            changePage("Home", true, false, null);
                        })
                    }}>Guest Login</button>
                </div>
            </div>
        );
    }
}


export class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameInput: "",
            emailInput: "",
            passwordInput: "",
            verifInput: "",
            usernameError: "",
            emailError: "",
            passwordError: "",
            verifError: ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        if (inputElem.parentElement.id === "register-user") {
            newState.usernameInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "register-email") {
            newState.emailInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "register-pass") {
            newState.passwordInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "register-pass-verif") {
            newState.verifInput = inputElem.value;
        }
        this.setState(() => {return newState});
    }

    handleErrors(errorMsgs) {
        let newState = Object.assign({}, this.state);
        newState.usernameError = errorMsgs[0];
        newState.emailError = errorMsgs[1];
        newState.passwordError = errorMsgs[2];
        newState.verifError = errorMsgs[3];
        this.setState(() => {return newState});
    }

    render(){
        let dataModel = this.props.dataModel;

        return(
            <div id="register-page">
                <div id="register-wrapper">
                    <p className="register-title">Create Account</p>
                    <p className="register-mandatory">* indicates mandatory fields</p>
                    <div id="register-user" type="text">
                        <p className="entry-title">Username*</p>
                        <p className="entry-hint">Enter username</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.usernameError}</p>
                    </div>
                    <div id="register-email" type="text">
                        <p className="entry-title">Email*</p>
                        <p className="entry-hint">Enter unique email. Must be valid form, i.e: name@gmail.com</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.emailError}</p>
                    </div>
                    <div id="register-pass" type="text">
                        <p className="entry-title">Password*</p>
                        <p className="entry-hint">Password cannot contain username or email</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.passwordError}</p>
                    </div>
                    <div id="register-pass-verif" type="text">
                        <p className="entry-title">Verify Password*</p>
                        <p className="entry-hint">Re-enter the same password</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.verifError}</p>
                    </div>
                    <SignUp dataModel={dataModel} inputsAndErrorMsgs={this.state} handleErrors={this.handleErrors}
                        onTabClick={this.props.changePage}/>
                </div>
            </div>
        );
    }
}


class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.handleSignUpClick = this.handleSignUpClick.bind(this);
    }

    handleSignUpClick() {
        let dataModel = this.props.dataModel;
        let usernameInput = this.props.inputsAndErrorMsgs.usernameInput;
        let emailInput = this.props.inputsAndErrorMsgs.emailInput;
        let passwordInput = this.props.inputsAndErrorMsgs.passwordInput;
        let verifInput = this.props.inputsAndErrorMsgs.verifInput;
        let usernameError = this.props.inputsAndErrorMsgs.usernameError;
        let emailError = this.props.inputsAndErrorMsgs.emailError;
        let passwordError = this.props.inputsAndErrorMsgs.passwordError;
        let verifError = this.props.inputsAndErrorMsgs.verifError;

        let newErrorMsgs = [];
        if (usernameInput.trim().length === 0) {
            usernameError = "*This field is mandatory. You must enter a username.";
        }
        else {
            usernameError = "";
        }
        newErrorMsgs.push(usernameError);

        if (emailInput.trim().length === 0) {
            emailError = "*This field is mandatory. You must enter an email.";
        }
        else {
            emailError = "";
            let cleanedEmail = emailInput.trim().toLowerCase();
            let allUsers = dataModel.users;
            let userObject = allUsers.find(user => user.email === cleanedEmail);
            if (userObject !== undefined){
                emailError = "*This email is already in use. You must enter a unique email.";
            }
            else{
                let regex = /[^@ ]+?@[^@ \.]+?\.[a-z]+/gi;
                let matchArr = cleanedEmail.match(regex);
                if (matchArr === null || matchArr[0] !== cleanedEmail){
                    emailError = "*This is not a valid email. The format must be blahblah@site.domain.";
                }
            }
        }
        newErrorMsgs.push(emailError);

        if (passwordInput.length === 0) {
            passwordError = "*This field is mandatory. You must enter a password.";
        }
        else {
            passwordError = "";
            if (usernameError !== ""){
                passwordError = "*You must enter a valid username first."
            }
            else if (emailError !== ""){
                passwordError = "*You must enter a valid email first."
            }
            else{
                if (passwordInput.includes(usernameInput)){
                    passwordError = "*Password cannot contain your username.";
                }
                else{
                    let cleanedEmail = emailInput.trim().toLowerCase();
                    let regex = /[^@ ]+?@/gi;
                    let matchArr = cleanedEmail.match(regex);
                    if (matchArr !== null){
                        let emailId = matchArr[0].substring(0, matchArr[0].length - 1);
                        if (passwordInput.includes(emailId) && cleanedEmail !== ""){
                            passwordError = "*Password cannot contain your email id.";
                        }
                    }
                }
            }
        }
        newErrorMsgs.push(passwordError);

        if (verifInput.length === 0) {
            verifError = "*This field is mandatory. You must re-enter your password";
        }
        else {
            verifError = "";
            if (verifInput !== passwordInput){
                verifError = "*The passwords don't match.";
            }
        }
        newErrorMsgs.push(verifError);

        if (usernameError.length === 0 && emailError.length === 0
            && passwordError.length === 0 && verifError.length === 0) {
            let cleanedEmail = emailInput.trim().toLowerCase();
            let newUser = {
                username: usernameInput.trim(),
                email: cleanedEmail,
                password: passwordInput,
                admin: false,
                member_time: Date.now(),
                rep: 0,
                asked_qs: [],
                created_tags: [],
                answered_qs: []
            };

            axios.post('http://localhost:8000/create/user', newUser, {withCredentials:true})
                .then((res) => {
                    this.props.onTabClick("Login", false, true);
                });
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }
    }

    render() {
        return(
            <button id="sign-up" onClick={this.handleSignUpClick}>Sign Up</button>
        );
    }
}


export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: "",
            passwordInput: "",
            emailError: "",
            passwordError: "",
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleInputChange(e) {
        let newState = Object.assign({}, this.state);
        let inputElem = e.target;
        if (inputElem.parentElement.id === "login-email") {
            newState.emailInput = inputElem.value;
        }
        else if (inputElem.parentElement.id === "login-pass") {
            newState.passwordInput = inputElem.value;
        }
        this.setState(() => {return newState});
    }

    handleErrors(errorMsgs) {
        let newState = Object.assign({}, this.state);
        newState.emailError = errorMsgs[0];
        newState.passwordError = errorMsgs[1];
        this.setState(() => {return newState});
    }

    render(){
        let dataModel = this.props.dataModel;

        return (
            <div id="login-page">
                <div id="login-wrapper">
                    <p className="login-title">Login</p>
                    <p className="login-mandatory">* indicates mandatory fields</p>
                    <div id="login-email" type="text">
                        <p className="entry-title">Email*</p>
                        <p className="entry-hint">Enter valid email</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.emailError}</p>
                    </div>
                    <div id="login-pass" type="text">
                        <p className="entry-title">Password*</p>
                        <p className="entry-hint">Enter password</p>
                        <input className="entry-box" onChange={this.handleInputChange} type="text" />
                        <p className="error-message">{this.state.passwordError}</p>
                    </div>
                    <Login dataModel={dataModel} inputsAndErrorMsgs={this.state} handleErrors={this.handleErrors}
                        onTabClick={this.props.changePage}/>
                </div>
            </div>
        );
    }
}


class Login extends React.Component {
    constructor(props){
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleLoginClick(){
        let dataModel = this.props.dataModel;
        let emailInput = this.props.inputsAndErrorMsgs.emailInput;
        let passwordInput = this.props.inputsAndErrorMsgs.passwordInput;
        let emailError = this.props.inputsAndErrorMsgs.emailError;
        let passwordError = this.props.inputsAndErrorMsgs.passwordError;
        let newErrorMsgs = [];
        let userObject = null;

        if (emailInput.trim().length === 0) {
            emailError = "*This field is mandatory. You must enter an email.";
        }
        else {
            emailError = "";
            let cleanedEmail = emailInput.trim().toLowerCase();
            let allUsers = dataModel.users;
            userObject = allUsers.find(user => user.email === cleanedEmail);
            if (userObject === undefined){
                emailError = "*This email is not recognized. You must enter a valid email.";
            }
        }
        newErrorMsgs.push(emailError);

        if (passwordInput.length === 0) {
            passwordError = "*This field is mandatory. You must enter a password.";
        }
        else {
            passwordError = "";
            if (emailError !== ""){
                passwordError = "*You must enter a valid email first."
            }
        }
        newErrorMsgs.push(passwordError);

        if (emailError.length === 0 && passwordError.length === 0) {
            let cleanedEmail = emailInput.trim().toLowerCase();
            let loginObj = {
                entryEmail: cleanedEmail,
                entryPass: passwordInput,
                user: userObject
            }
            axios.post('http://localhost:8000/login', loginObj, {withCredentials:true})
                .then((correctPass) => {
                    if (correctPass.data){
                        this.props.onTabClick("Home", false, false, userObject);
                    }
                    else{
                        passwordError = "*Wrong password. Try again.";
                        newErrorMsgs.pop();
                        newErrorMsgs.push(passwordError);
                        this.props.handleErrors(newErrorMsgs);
                    }
                })
        }
        else {
            this.props.handleErrors(newErrorMsgs);
        }

    }

    render(){
        return(
            <button id="login" onClick={this.handleLoginClick}>Login</button>
        );
    }
}
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All Fields are required');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }
    
    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm" 
            name="loginForm" 
            onSubmit={handleLogin} 
            action="/login"
            method="POST"
            lassName="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input type="text" id="user" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input type="password" id="pass" name="pass" placeholder="password"/>
            <input type="submit" className="formSubmit" value="Sign In"/>
        </form>
    );
}

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input type="text" id="user" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input type="password" id="pass" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input type="password" id="pass2" name="pass2" placeholder="retype password"/>
            <input type="submit" className="formSubmit" value="Sign Up"/>
        </form>
    );
}

const init = () => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    ReactDOM.render(<LoginWindow />,
            document.querySelector('#login'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow />,
            document.querySelector('#login'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow />,
            document.querySelector('#login'));
        return false;
    });
}

window.onload = init;
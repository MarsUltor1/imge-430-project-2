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

    helper.sendPost(e.target.action, { username, pass });

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

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
}

const LoginWindow = (props) => {
    return (
        <div className="box">
            <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                lassName="mainForm"
            >
                <label className="label first">Username:</label>
                <input type="text" id="user" className="input is-small" placeholder="username" />
                <label className="label">Password:</label>
                <input type="password" id="pass" className="input is-small" placeholder="password" />
                <input type="submit" className="formSubmit button is-small" value="Sign In" />
            </form>
        </div>
    );
}

const SignupWindow = (props) => {
    return (
        <div className="box">
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
                className="mainForm"
            >
                <label className="label first">Username:</label>
                <input type="text" id="user" className="input is-small" placeholder="username" />
                <label className='label'>Password:</label>
                <input type="password" id="pass" className="input is-small" placeholder="password" />
                <label className="label">Password:</label>
                <input type="password" id="pass2" className="input is-small" placeholder="retype password" />
                <input type="submit" className="formSubmit button is-small" value="Sign Up" />
            </form>
        </div>
    );
}

const init = () => {
    // make sure user isn't listening for socket changes of this page
    helper.socket.off('tweetchange');

    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    loginButton.classList.add('is-active');

    ReactDOM.render(<LoginWindow />,
        document.querySelector('#login'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        signupButton.classList.remove('is-active');
        loginButton.classList.add('is-active');

        ReactDOM.render(<LoginWindow />,
            document.querySelector('#login'));
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        loginButton.classList.remove('is-active');
        signupButton.classList.add('is-active');

        ReactDOM.render(<SignupWindow />,
            document.querySelector('#login'));
        return false;
    });
}

window.onload = init;
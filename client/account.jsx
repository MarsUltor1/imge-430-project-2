const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleChange = (e) => {
    e.preventDefault();
    helper.hideError();

    // Get all the inputs
    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    // Check that all the inputs were filled out
    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('All Fields are Required!');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('New Passwords do not Match!');
        return false;
    }

    helper.sendPost(e.target.action, { oldPass, newPass, newPass2 });

    return false;
}

const PassChangeWindow = (props) => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            className="mainForm"
            onSubmit={handleChange}
            action="/changePassword"
            method="POST"
        >
            <label className="label">Current Password:</label>
            <input type="password" id="oldPass" className="input is-small" placeholder="Current Password" />
            <label className="label">New Password:</label>
            <input type="password" id="newPass" className="input is-small" placeholder="New Password" />
            <label className="label">New Password:</label>
            <input type="password" id="newPass2" className="input is-small" placeholder="Retype New Password" />
            <input type="submit" className="formSubmit button is-small" value="Change Password" />
        </form>
    );
}


// React component for account information
const AccountInfo = (props) => {
    if (!props.account) {
        return (
            <div>
                <h1>Loading Account...</h1>
            </div>
        );
    }

    if (props.account.premium) {
        return (
            <div className="box">
                <label className="label first">Username:</label>
                <p>{props.account.username}</p>
                <label className="label">User Since:</label>
                <p>{helper.formatDate(props.account.date)}</p>
                <label className="label">Premium Status:</label>
                <p>Subscribed to Premium</p>
                <button id="cancelPremium" className="button is-small" onClick={cancelPremium}>
                    Cancel Subscription
                </button>
            </div>
        )
    }
    else {
        return (
            <div className="box">
                <label className="label first">Username:</label>
                <p>{props.account.username}</p>
                <label className="label">User Since:</label>
                <p>{helper.formatDate(props.account.date)}</p>
                <label className="label">Premium Status:</label>
                <p>Not Subscribed to Premium</p>
                <button id="buyPremium" className="button is-small" onClick={makePremium}>
                    Subscribe for $9.99/m
                </button>
            </div>
        )
    }

}

// Make get request for user information
const loadUserInfo = async () => {
    const response = await fetch('/accountInfo');
    const data = await response.json();
    ReactDOM.render(
        <AccountInfo account={data.info} />,
        document.querySelector('#accountInfo')
    );
}

// call renderer on password changing form
const showPasswordChanger = () => {
    ReactDOM.render(
        <PassChangeWindow />,
        document.querySelector('#changePassword')
    );
}

// Send a post request to make user premium
const makePremium = (e) => {
    helper.sendPost('/getPremium', {}, () => {
        // re-render account info with updated information
        loadUserInfo();
        helper.sendChangeNotification();
    });
}

// Send a post request to cancel premium
const cancelPremium = (e) => {
    helper.sendPost('/cancelPremium', {}, () => {
        loadUserInfo();
        helper.sendChangeNotification();
    });
}

const init = async () => {
    // make sure user isn't listening for socket changes of this page
    helper.socket.off('tweetchange');

    // Render out base info screen
    ReactDOM.render(<AccountInfo />,
        document.querySelector('#accountInfo'));

    // Setup functionality for password changing button
    document.querySelector('#changePassBtn')
        .addEventListener('click', showPasswordChanger);

    // Load in user info
    loadUserInfo();

    return false;
}

window.onload = init;
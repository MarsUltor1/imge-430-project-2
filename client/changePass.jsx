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

    helper.sendPost(e.target.action, {oldPass, newPass, newPass2});

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
            <label htmlFor="oldPass">Current Password: </label>
            <input type="password" id="oldPass" name="oldPass" placeholder="Current Password"/>
            <label htmlFor="newPass">New Password: </label>
            <input type="password" id="newPass" name="newPass" placeholder="New Password"/>
            <label htmlFor="newPass2">New Password: </label>
            <input type="password" id="newPass2" name="newPass2" placeholder="Retype New Password"/>
            <input type="submit" className="formSubmit" value="Change Password"/>
        </form>
    );
}

const init = () => {
    ReactDOM.render(<PassChangeWindow/>,
        document.querySelector('#changePassword'));
    return false;
}

window.onload = init;
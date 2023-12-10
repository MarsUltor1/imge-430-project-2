const socket = io();

// Display error message in the error message element
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
};

// send a post request to the given url with data in the body
// call the handler on completion if there is one
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('errorMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

// hide any error messages
const hideError = () => {
    document.querySelector('#errorMessage').classList.add('hidden');
}; 

// takes date string and turns it into a well formated string for display
const formatDate = (date) => {
    let dateArray = date.split('T');
    let day = dateArray[0].split('-');
    let time = dateArray[1].split(':');

    return `${day[1]}/${day[2]}/${day[0]} at ${time[0]}:${time[1]}`;
}

// hide element with given id
const hideById = (id) => {
    document.getElementById(id).classList.add('hidden');
    console.log('element hidden');
}

// show element with given id
const showById = (id) => {
    document.getElementById(id).classList.remove('hidden');
}

const sendChangeNotification = () => {
    socket.emit('tweet change');
}

module.exports = {
    handleError,
    sendPost,
    hideError,
    formatDate,
    hideById,
    showById,
    sendChangeNotification,
    socket,
}
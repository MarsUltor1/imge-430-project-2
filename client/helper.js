/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
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

module.exports = {
    handleError,
    sendPost,
    hideError,
    formatDate,
}
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');



const handleTweet = (e) => {
    e.preventDefault();
    helper.hideError();

    const content = e.target.querySelector('#tweetContent').value;

    if (!content) {
        helper.handleError('Tweet cannot be empty!');
        return false;
    }


    // clear tweet box
    e.target.querySelector('#tweetContent').value = '';

    helper.sendPost(e.target.action, { content }, loadTweetsFromServer);

    return false;
}

const TweetForm = (props) => {
    return (


        <form id="tweetForm"
            onSubmit={handleTweet}
            name="tweetForm"
            action="/tweet"
            method="POST"
            className="tweet-form box"
        >
            <label className="label">Tweet:</label>
            <input type="text" id="tweetContent" className="input is-small" placeholer="Tweet Content" />
            <input type="submit" className="button is-small" value="Tweet" />
        </form>
    );
}

// Send post request to change tweet privacy
const togglePrivacy = async (id) => {
    helper.hideError();
    await helper.sendPost('/togglePrivacy', { id }, () => {
        // reload tweets and send notification that tweets have changed
        loadTweetsFromServer();
        helper.sendChangeNotification();
    });
    
}

// Send post request to delete a tweet
const deleteTweet = async (id) => {
    helper.hideError();
    await helper.sendPost('/deleteTweet', {id}, () => {
        // reload tweets and send notification that tweets have changed
        loadTweetsFromServer();
        helper.sendChangeNotification();
    });
    
}

// React component to display user's tweets with controls
const TweetList = (props) => {
    if (props.tweets.length === 0) {
        return (
            <div className="tweetList">
                <h3 className="emptyTweet">No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = props.tweets.map(tweet => {
        // Check if user has bought premium
        if (tweet.premium) {
            // If premium user add check mark
            return (
                <div className="tweet box" key={tweet._id}>
                    <p>
                        <strong>{tweet.username} <span className="icon"><i className="fas fa-solid fa-square-check"></i></span></strong><small>{helper.formatDate(tweet.createdDate)}</small>
                        <br></br>
                        {tweet.content}
                    </p>
                    <nav className="field has-addons">
                        <p class="control">
                            <button className="button is-small" id="privacyBtn" onClick={() => togglePrivacy(tweet._id)}>
                                <span>{tweet.public ? 'Make Private' : 'Make Public'}</span>
                            </button>
                        </p>
                        <p class="control">
                            <button className="button is-small" id="deleteBtn" onClick={() => deleteTweet(tweet._id)}>
                                <span>Delete</span>
                            </button>
                        </p>
                    </nav>
                </div>
            );
        }
        else {
            // Don't include check if user is not premium
            return (
                <div className="tweet box" key={tweet._id}>
                    <p>
                        <strong>{tweet.username} <span className="icon"></span></strong><small>{helper.formatDate(tweet.createdDate)}</small>
                        <br></br>
                        {tweet.content}
                    </p>
                    <nav className="field has-addons">
                        <p class="control">
                            <button className="button is-small" id="privacyBtn" onClick={() => togglePrivacy(tweet._id)}>
                                <span >{tweet.public ? 'Make Private' : 'Make Public'}</span>
                            </button>
                        </p>
                        <p class="control">
                            <button className="button is-small" id="deleteBtn" onClick={() => deleteTweet(tweet._id)}>
                                <span>Delete</span>
                            </button>
                        </p>
                    </nav>
                </div>
            );
        }
    });

    // Reverse tweets so that newest tweets are on top
    tweetNodes.reverse();

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
}

// Make a get request for a current user's tweets 
// and reload the tweets section
const loadTweetsFromServer = async () => {
    const response = await fetch('/getTweets');
    const data = await response.json();

    // Make sure the tweet form is visible
    helper.showById('writingSection');

    // Render out all the tweets
    ReactDOM.render(
        <TweetList tweets={data.tweets} />,
        document.querySelector('#tweets')
    );
}

// React component to display tweets without any controls
const AllTweetList = (props) => {
    if (props.tweets.length === 0) {
        return (
            <div className="tweetList">
                <h3 className="emptyTweet">No Tweets Yet!</h3>
            </div>
        );
    }

    // Setup the structure of each tweet
    const tweetNodes = props.tweets.map(tweet => {
        // Check if user has bought premium
        if (tweet.premium) {
            // If premium user add check mark
            return (
                <div className="tweet box" key={tweet._id}>
                    <p>
                        <strong>{tweet.username} <span className="icon"><i className="fas fa-solid fa-square-check"></i></span></strong><small>{helper.formatDate(tweet.createdDate)}</small>
                        <br></br>
                        {tweet.content}
                    </p>
                </div>
            );
        }
        else {
            // Don't include check if user is not premium
            return (
                <div className="tweet box" key={tweet._id}>
                    <p>
                        <strong>{tweet.username} <span className="icon"></span></strong><small>{helper.formatDate(tweet.createdDate)}</small>
                        <br></br>
                        {tweet.content}
                    </p>
                </div>
            );
        }
    });

    // Reverse order of tweets so that newest is shown first
    tweetNodes.reverse();

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
}

const loadAllTweetsFromServer = async () => {
    const response = await fetch('/getAllTweets');
    const data = await response.json();

    // Make sure the tweet form is hidden
    helper.hideById('writingSection');

    // Render out all the tweets
    ReactDOM.render(
        <AllTweetList tweets={data.tweets} />,
        document.querySelector('#tweets')
    );
}

const SponsoredTweet = (props) => {
    return (
        <div className="tweet box" key={props.tweet.id}>
            <p>
                <strong>{props.tweet.username} <span className="icon"></span></strong><small>{props.tweet.date}</small>
                <br></br>
                {props.tweet.content}
            </p>
        </div>
    );
}

const init = async () => {
    // stop listening for socket changes
    helper.socket.off('tweet change');

    // Render the tweet writer
    ReactDOM.render(
        <TweetForm />,
        document.querySelector('#writeTweet')
    );

    // Render out the sponsored tweet
    ReactDOM.render(
        <SponsoredTweet tweet={{
            id: "sponsorTweet",
            username: "Sponsor",
            content: "Placeholder for a paid tweet, will show up at the top of every feed",
            date: "12/8/2023 at 13:07"
        }} />,
        document.querySelector('#sponsorDiv')
    );

    // Render out user tweets
    ReactDOM.render(
        <TweetList tweets={[]} />,
        document.querySelector('#tweets')
    );

    // Fill in all the stored tweets
    await loadTweetsFromServer();

    // Setup buttons to switch between feeds
    const myTweetsBtn = document.querySelector('#myTweetsBtn');
    const allTweetsBtn = document.querySelector('#allTweetsBtn');

    myTweetsBtn.classList.add('is-active')

    myTweetsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadTweetsFromServer();

        // Change active button
        allTweetsBtn.classList.remove('is-active');
        myTweetsBtn.classList.add('is-active');

        // stop listening for socket changes
        helper.socket.off('tweet change');
        return false;
    });

    allTweetsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadAllTweetsFromServer();

        // Change active button
        myTweetsBtn.classList.remove('is-active');
        allTweetsBtn.classList.add('is-active');

        // start listening for socket changes
        helper.socket.on('tweet change', loadAllTweetsFromServer);
        return false;
    });
}

window.onload = init;
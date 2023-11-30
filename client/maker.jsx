const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const formatDate = (date) => {
    let dateArray = date.split('T');
    let day = dateArray[0].split('-');
    let time = dateArray[1].split(':');

    return `${day[1]}/${day[2]}/${day[0]} at ${time[0]}:${time[1]}`;
}

const handleTweet = (e) => {
    e.preventDefault();
    helper.hideError();

    const content = e.target.querySelector('#tweetContent').value;

    if (!content) {
        helper.handleError('Tweet cannot be empty!');
        return false;
    }

    helper.sendPost(e.target.action, {content}, loadTweetsFromServer);

    return false;
}

const TweetForm = (props) => {
    return (
        <form id="tweetForm"
            onSubmit={handleTweet}
            name="tweetForm"
            action="/tweet"
            method="POST"
            className="tweet-form"
        >
            <label htmlFor="content">Tweet: </label>
            <input type="text" id="tweetContent" name="content" placeholder="Tweet Text"/>

            <input type="submit" className="writeTweetSubmit" value="Tweet"/>
        </form>
    );
}

const TweetList = (props) => {
    if (props.tweets.length === 0) {
        return (
            <div className="tweetList">
                <h3 className="emptyTweet">No Tweets Yet!</h3>
            </div>
        );
    }

    const tweetNodes = props.tweets.map(tweet => {
        return (
            <div className="tweet" key={tweet._id}>
                <h3 className="username">{tweet.username}</h3>
                <h4 className="content">{tweet.content}</h4>
                <p className="date">Tweeted: {formatDate(tweet.createdDate)}</p>
            </div>
        );
    });

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
}

const loadTweetsFromServer = async () => {
    const response = await fetch('/getTweets');
    const data = await response.json();
    ReactDOM.render(
        <TweetList tweets={data.tweets} />,
        document.querySelector('#tweets')
    );
}

const init = () => {
    ReactDOM.render(
        <TweetForm/>,
        document.querySelector('#writeTweet')
    );

    ReactDOM.render(
        <TweetList tweets={[]}/>,
        document.querySelector('#tweets')
    );

    loadTweetsFromServer();
}

window.onload = init;
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
            className="tweet-form"
        >
            <label htmlFor="content">Tweet: </label>
            <input type="text" id="tweetContent" name="content" placeholder="Tweet Text" />

            <input type="submit" className="writeTweetSubmit" value="Tweet" />
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
                <p className="date">Tweeted: {helper.formatDate(tweet.createdDate)}</p>
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

const AllTweetList = (props) => {
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
                <p className="date">Tweeted: {helper.formatDate(tweet.createdDate)}</p>
            </div>
        );
    });

    return (
        <div className="tweetList">
            {tweetNodes}
        </div>
    );
}

const loadAllTweetsFromServer = async () => {
    const response = await fetch('/getAllTweets');
    const data = await response.json();
    ReactDOM.render(
        <AllTweetList tweets={data.tweets} />,
        document.querySelector('#tweets')
    );
}

const SponsoredTweet = (props) => {
    return (
        <div className="tweet" key={props.tweet.id}>
            <h3 className="username">{props.tweet.username}</h3>
            <h4 className="content">{props.tweet.content}</h4>
            <p className="date">Tweeted: {props.tweet.date}</p>
        </div>
    );
}

const init = () => {
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
    loadTweetsFromServer();

    // Setup buttons to switch between feeds
    const myTweetsBtn = document.querySelector('#myTweetsBtn');
    const allTweetsBtn = document.querySelector('#allTweetsBtn');

    myTweetsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadTweetsFromServer();
        return false;
    });

    allTweetsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadAllTweetsFromServer();
        return false;
    });
}

window.onload = init;
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
            className="tweetForm"
        >
            <label htmlFor="content">Tweet: </label>
            <input type="text" id="tweetContent" name="content" placeholder="Tweet Text"/>

            <input type="submit" className="writeTweetSubmit" value="Tweet"/>
        </form>
    );
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div className="domo" key={domo._id}>
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoSkill"> Skill: {domo.skill} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.querySelector('#domos')
    );
}

const init = () => {
    ReactDOM.render(
        <TweetForm/>,
        document.querySelector('#writeTweet')
    );

    ReactDOM.render(
        <DomoList domos={[]}/>,
        document.querySelector('#tweets')
    );

    loadDomosFromServer();
}

window.onload = init;
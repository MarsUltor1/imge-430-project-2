const models = require('../models');

const { Tweet, Account } = models;

const writingPage = async (req, res) => res.render('app');

const writeTweet = async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'Written Content is Required!' });
  }

  const tweetData = {
    username: req.session.account.username,
    content: req.body.content,
    owner: req.session.account._id,
  };

  try {
    const newTweet = new Tweet(tweetData);
    await newTweet.save();
    return res.status(201).json({
      username: newTweet.username,
      content: newTweet.content,
      date: newTweet.createdDate,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists!' });
    }
    return res.status(500).json({ error: 'An error occured posting tweet!' });
  }
};

const getTweets = async (req, res) => {
  try {
    const resJson = {
      tweets: [],
    };

    // Get the tweets
    const docs = await Tweet.find({ owner: req.session.account._id })
      .select('content createdDate').lean().exec();

    // Get user information
    const owner = await Account.find({ _id: req.session.account._id })
      .select('username premium').lean().exec();

    // Add user info into each tweet
    docs.forEach((tweet) => {
      resJson.tweets.push({
        content: tweet.content,
        createdDate: tweet.createdDate,
        username: owner[0].username,
        premium: owner[0].premium,
      });
    });

    // Send tweets to user
    return res.json(resJson);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tweets!' });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const resJson = {
      tweets: [],
    };

    // Get the tweets
    const docs = await Tweet.find()
      .select('owner content createdDate').lean().exec();
    console.log(docs);

    const promises = [];

    for (let i = 0, end = docs.length; i < end; i++) {
      // Get user info for current tweet
      const ownerPromise = Account.find({ _id: docs[i].owner })
        .select('username premium').lean().exec();

      promises.push(ownerPromise);

      ownerPromise.then((owner) => {
        // Add user info into each tweet
        resJson.tweets.push({
          content: docs[i].content,
          createdDate: docs[i].createdDate,
          username: owner[0].username,
          premium: owner[0].premium,
        });
      });
    }

    return Promise.all(promises).then(() => res.json(resJson));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tweets!' });
  }
};

module.exports = {
  writingPage,
  writeTweet,
  getTweets,
  getAllTweets,
};

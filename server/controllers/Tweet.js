const models = require('../models');

const { Tweet } = models;

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
    return res.status(201).json({ username: newTweet.username, 
      content: newTweet.content, 
      date: newTweet.createdDate });
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
    const query = { owner: req.session.account._id };
    const docs = await Tweet.find(query).select('username content createdDate').lean().exec();

    return res.json({ tweets: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tweets!' });
  }
};

const getAllTweets = async (req, res) => {
  try {
    const docs = await Tweet.find().select('username content createdDate').lean().exec();

    return res.json({ tweets: docs });
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

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
      .select('content createdDate public').lean().exec();

    // Get user information
    const owner = await Account.find({ _id: req.session.account._id })
      .select('username premium').lean().exec();

    // Add user info into each tweet
    docs.forEach((tweet) => {
      resJson.tweets.push({
        content: tweet.content,
        createdDate: tweet.createdDate,
        _id: tweet._id,
        username: owner[0].username,
        premium: owner[0].premium,
        public: tweet.public,
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
      .select('owner content createdDate public').lean().exec();

    const promises = [];

    for (let i = 0, end = docs.length; i < end; i++) {
      // Check that the tweet is public
      if (docs[i].public) {
        // Get user info for current tweet
        const ownerPromise = Account.find({ _id: docs[i].owner })
          .select('username premium').lean().exec();

        promises.push(ownerPromise);

        ownerPromise.then((owner) => {
          // Add user info into each tweet
          resJson.tweets.push({
            content: docs[i].content,
            createdDate: docs[i].createdDate,
            _id: docs[i]._id,
            username: owner[0].username,
            premium: owner[0].premium,
          });
        });
      }
    }

    return Promise.all(promises).then(() => res.json(resJson));
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tweets!' });
  }
};

const togglePrivacy = async (req, res) => {
  // check for id in body
  if (!req.body.id) {
    return res.status(400).json({ error: 'Cannot change privacy without an id' });
  }

  try {
    const tweet = { _id: req.body.id };

    // Get current privacy
    const pubStatus = await Tweet.findOne(tweet).select('public').lean().exec();

    // Send change request to database
    if (pubStatus.public) {
      await Tweet.updateOne(tweet, { $set: { public: false } });
    } else {
      await Tweet.updateOne(tweet, { $set: { public: true } });
    }

    // Return success message
    return res.json({ success: 'Tweet privacy updated' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error while changing privacy' });
  }
};

const deleteTweet = async (req, res) => {
  // check for id in body
  if (!req.body.id) {
    return res.status(400).json({ error: 'Cannot change privacy without an id' });
  }

  try {
    const tweet = { _id: req.body.id };

    // send delete request to database
    await Tweet.deleteOne(tweet).exec();

    // send status to user
    return res.json({ success: 'Tweet deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error while deleting tweet' });
  }
};

module.exports = {
  writingPage,
  writeTweet,
  getTweets,
  getAllTweets,
  togglePrivacy,
  deleteTweet,
};

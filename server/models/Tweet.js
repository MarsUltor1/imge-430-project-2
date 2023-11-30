const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.statics.toAPI = (doc) => ({
  content: doc.content,
  username: doc.username,
  date: doc.createdDate,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
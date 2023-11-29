const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const TweetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    set: setName,
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
  content: doc.name,
  username: doc.age,
  date: doc.createdDate,
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
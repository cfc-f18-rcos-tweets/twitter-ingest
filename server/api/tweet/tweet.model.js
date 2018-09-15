const mongoose = require('mongoose')
const Schema = mongoose.Schema

// // // //

// Documentation:
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object
const Tweet = new Schema(
  {
    query: {
      type: String
    },
    tweet_id: {
      type: Number
    },
    created_at: {
      type: Date
    },
    text: {
      type: String
    },
    user: {
      type: Schema.Types.Mixed
    },
    place: {
      type: Schema.Types.Mixed
    },
    entities: {
      type: Schema.Types.Mixed
    },
    geo: {
      type: Schema.Types.Mixed
    },
    coordinates: {
      type: Schema.Types.Mixed
    },
    place: {
      type: Schema.Types.Mixed
    }
  },
  // Collection options
  {
  	 timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updatedOn'
   },
    versionKey: false
  }
  );

module.exports = mongoose.model('Tweet', Tweet)

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
    user_id: {
      type: Number
    },
    user_name: {
      type: String
    },
    user_screen_name: {
      type: String
    },
    user_location: {
      type: String
    },
    user_followers_count: {
      type: Number
    },
    user_friends_count: {
      type: Number
    },
    user_created_at: {
      type: Date
    },
    user_time_zone: {
      type: String
    },
    user_profile_background_color: {
      type: String
    },
    user_profile_image_url: {
      type: String
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

const Tweet = require('./tweet.model')
const Twitter = require('twitter');
const _ = require('lodash');

// // // //

// Twitter Client Instantiation
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// // // //

// formatTweetData
// Isolates the desired data to be exported by the exportTweets function
function formatTweetData(tweet, query) {

  // Assigns query to tweet for easy retrieval
  tweet.query = query.search

  // Stores tweet.id elsewhere (`id` is reserved)
  tweet.tweet_id = tweet.id_str
  delete tweet.id_str

  // Returns the tweet with ONLY the attributes we want to export
  return tweet
}

// openTwitterStream
// Opens a stream up to twitter
function openTwitterStream (query) {

  // Defines default query.search & query.count
  query.search = query.search || 'florence';
  query.count = query.count || 1000000;

  // Opens up a Twitter stream
  const stream = twitterClient.stream('statuses/filter', { track: query.search });

  // Track the number of tweets ingested
  let tweetCount = 0;

  // Stream `data` event handler
  stream.on('data', (event) => {

    // Stores the tweet
    tweetCount = tweetCount + 1;

    // Formats the data
    const tweet = formatTweetData(event, query);

    // Saves the tweet to the database
    Tweet.create(tweet)
    .then((mongooseDocument) => {
      // Logs success message to console
      console.info(`CREATED "${query.search}" TWEET`)
    })
    .catch((err) => {
      // Throws error
      throw error;
    })

    // Closes the stream and writes the file when the requisite number of tweets have been collected
    if (tweetCount === Number(query.count)) {

      // Destroys the Twitter stream
      stream.destroy();

    }

  });

  // Stream 'error' event handler
  stream.on('error', (error) => {

    // Throws error
    throw error;

  });

  // Returns the twitter stream
  return stream;

}

// // // //

/**
* @api {get} /api/tweets Index
* @APIname Index
* @APIgroup Tweet Controller
* @apidescription Gets list of current Tweets
* @apiSuccess {json} Collection of Tweets
* @apiError (Error) 500 Internal server error
*/
module.exports.list = (req, res, next) => {
    return Tweet
    .find({ query: req.query.search || 'florence' }, '-_id -query')
    .sort({ 'createdOn': -1 })
    .limit(Number(req.query.count || 10))
    .exec()
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch(next);
};


/**
* @api {POST} /api/tweets Create
* @APIname Create
* @APIgroup Tweet Controller
* @apidescription Creates a new Tweet
* @apiSuccess {json} The newly created Tweet
* @apiError (Error) 500 Internal server error
*/
module.exports.create = (req, res, next) => {

    // Respond to the client with a message that their request has been received
    res.json({ received: true });

    // Create a new Twitter Stream with the parameters
    return openTwitterStream(req.query);

};


// Constantized API_ENPOINT
const API_ENDPOINT = 'http://localhost:3000'

// Hits the server interface for populating MongoDB with Tweets
function writeTweetsAPI (params) {

  // Assembles URL
  let url = ['/api/tweets', '?', Qs.stringify(params)].join('')

  // Returns a Promise to manage async behavior
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'post' })
    .then((response) => { return response.json() })
    .then((response) => { return resolve(response) })
    .catch((err) => { return reject(err) })
  })

}

// Hits the server interface for reading Tweets from MongoDB
function readTweetsAPI (params) {

  // Assembles URL
  let url = ['/api/tweets', '?', Qs.stringify(params)].join('')

  // Returns a Promise to manage async behavior
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => { return response.json() })
    .then((response) => { return resolve(response) })
    .catch((err) => { return reject(err) })
  })

}

// // // //
// VueJS Components & Application

// Loading Component
Vue.component('loading-card', {
  template: `
    <div class='card card-body bg-dark t border-light text-center d-flex justify-content-center align-items-center'>
      <i class='fa fa-fw fa-spin fa-2x my-4 fa-spinner'></i>
    </div>
  `
});

// Tweets Form Component
Vue.component('tweets-form', {
  props: ['params', 'onClickFetch', 'onClickRead', 'enabled', 'disableFetch'],
  template: `
    <div class='row'>

      <div class='col-sm-3'>
        <div class='form-group'>
          <input class='form-control form-control-lg' type='text' placeholder="Query" v-model="params.search" :disabled="enabled" />
        </div>
      </div>

      <div class='col-sm-3'>
        <div class='form-group'>
          <input class='form-control form-control-lg' type='number' placeholder="Count" v-model="params.count" :disabled="enabled" />
        </div>
      </div>

      <div class='col-sm-3'>
        <button class="btn btn-primary btn-lg btn-block" @click="onClickFetch()" :disabled="disableFetch" >
          Ingest Tweets
          <i class='fa fa-fw fa-twitter ml-2'></i>
        </button>
      </div>

      <div class='col-sm-3'>
        <button class="btn btn-success btn-lg btn-block" @click="onClickRead()" :disabled="disableFetch" >
          <i class='fa fa-fw fa-twitter fa-flip-horizontal mr-2'></i>
          Read Tweets
        </button>
      </div>

    </div>
  `
});

Vue.component('tweet-list', {
  props: ['tweets', 'fetched'],
  template: `
    <ul class='list-group'>
      <li class='list-group-item border-light' v-for="t in tweets" :key="t.tweet_id">
        <div class='row d-flex flex-row h-100'>
          <div class='col-sm-1 d-flex flex-column justify-content-center align-items-center'>
            <img class='profile-img' :src='t.user.profile_image_url'>
          </div>
          <div class='col-sm-11 d-flex flex-column justify-content-center text-dark'>
            {{t.text}}
          </div>
        </div>
      </li>

      <li class='list-group-item bg-dark text-warning border-warning text-center' v-if="!tweets[0] && fetched">
        <i class='fa fa-lg fa-times'></i>
        <p class='lead'>No tweets matching that query are available</p>
      </li>

      <li class='list-group-item bg-dark text-success border-success text-center' v-if="!fetched">
        <i class='fa fa-lg fa-twitter'></i>
        <p class='lead'>Tweets read from the server will be displayed here.</p>
      </li>

    </ul>
  `
})

// Layout Component definition
Vue.component('app-layout', {
  template: `
    <div class='row'>

      <div class='col-sm-12'>
      </div>

      <div class='col-sm-12'>
        <div class='row align-items-center'>
          <div class='col-sm-6'>
            <h2>
              Disaster Tweets
            </h2>
          </div>
          <div class='col-sm-6 d-flex align-items-center justify-content-end'>
            <button class='btn btn-outline-warning ml-2' @click="window.location.reload()">
              <i class='fa fa-fw fa-refresh mr-2'></i>
              Reset
            </button>
          </div>
        </div>

        <hr class='border-light' />

        <tweets-form :params="params" :onClickFetch="writeTweets" :onClickRead="readTweets" :enabled="formEnabled" :disableFetch="disableFetch" />

      </div>


      <div class='col-sm-12 mt-3'>
        <loading-card v-if="fetching" />
        <error-card v-else-if="error" />
        <tweet-list :tweets="tweets" :fetched="fetched" v-else />
      </div>

    </div>
  `,
  data () {
    return {
      tweets: [],
      fetched: false,
      fetching: false,
      error: false,
      params: {
        count: 1000,
        search: 'florence' // Default search
      }
    }
  },
  computed: {
    formEnabled () {
      return this.fetching
    },
    disableFetch () {
      return !this.params.search
    }
  },
  methods: {

    // Sends a request to write tweets into the database
    writeTweets () {

      // Sets this.fetching to true
      this.fetching = true;

      // Sets this.error to false
      this.error = false;

      // Sends the Tweets query to the server
      return writeTweetsAPI(this.params)
      .then((resp) => {

        // Sets this.fetching to false
        this.fetching = false;

      })
      .catch((err) => {
        this.error = true;
      })
    },

    // Sends a request to read tweets from the database
    readTweets () {

      // Sets this.fetching to true
      this.fetching = true;

      // Sets this.error to false
      this.error = false;

      // Flushes old tweets currently in the UI
      this.tweets = [];

      // Sends the Tweets query to the server
      return readTweetsAPI(this.params)
      .then((resp) => {

        // Assigns this.tweets
        this.tweets = resp;

        // Sets this.fetching to false
        this.fetching = false;

        // Sets this.fetched = true
        this.fetched = true;

      })
      .catch((err) => {
        this.error = true;
      })
    }
  }
});

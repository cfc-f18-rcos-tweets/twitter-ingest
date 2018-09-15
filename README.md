#### Alexander Schwartzberg
#### Lab 07 README

This builds upon my existing code from Lab 6. The Lab 06 README is included below for additional context.


**Deploy Instructions**

- Install dependencies with `npm install`

- Start MongoDB + MongoExpress with `docker-compose up -d`

- Run the server with the command `npm start`.

- View the application at `localhost:3000` and the MongoExpress admin interface at `localhost:8081`


**Changes**:

- Addition of `filename` input element to UI

- Addition of `Read Tweets` buttom element to UI. This button fetches tweets from MongoDB.

- Addition of `Reset` button element to UI. This is a rather rudimentary addition that simply refreshes the page by running `window.location.reload()`.


- Refactor of of `Fetch Tweets` functionality from previous lab. This button used to open a socket to stream tweets into the client. This button has been updated to instead trigger the server-side process that populates MongoDB with the tweets data. The `Read Tweets` button must be clicked to view tweets from MongoDB.

- Added `server/api/**/*` directory to modularize `tweets` API from the rest of the application. This is an organization decision that will enable this project to scale gracefully with more additions.

- Removed the server-side file saving logic since that now happens on the client

- Removed sockets from the server and client as we're no longer streaming tweets directly to the end-user

- The Twitter user's `profile_background_color` is used to color the list item for each Tweet.

- Added `bin/www` as a means of decoupling the MongoDB connection logic from the application. This is done to ensure that we never encouter a race condition where the application has started before a connection to MongoDB has been established.

- Added a `docker-compose.yml` file to start a single MongoDB container for the application. It also spawns a container running an instance [mongo-express](https://github.com/mongo-express/mongo-express), an admin web interface for MongoDB.

- Added an additional UI element to display a message when no tweets are available in the client.

**Notes:**

I used [mongoose](https://github.com/Automattic/mongoose) as a means to connect with MongoDB and define a schema for the tweets data we want to store. I used the `Schema.insertMany()` method provided by mongoose to quickly insert multiple documents into the database, rather than doing `Schema.create()` for each tweet.

When querying for tweets, I pull the data from MongoDB in descending order of `createdAt` so the newest tweets in the database will be displayed first.

The logic for streaming the Tweets from Twitter and formatting them has been moved into `tweets.controller.js`.

I used the [XML 2 JSON](https://github.com/abdmob/x2js) library to convert the server's JSON response into XML to be downloaded. If I were to further develop the Export functionality I would likely move this code to the server as it is becoming more dependency-intensive than in earlier labs.

#### Lab 06 README

This build upon my existing code from Lab 5. The Lab 05 README is included below for additional context.

The primary addition in this iteration was the addition of an `Export` feature. I was able to implement this feature solely on the client - there were no server-side changes beyond providing a default query.

Changes:

- Addition of Export Form component
- JSON to CSV conversion
- Auto-download of JSON & CSV Exports
- Added default tweet query as `facebook` and the default export format as `CSV`
- Prevent click of `Fetch Tweets` button if the user's query is empty.

For the `overwrite prompt` while downloading the file I rely on the native browser implementation to handle file overwrites, which either prompts the user to ask if they would like to overwrite the file, or it automatically renames the file to maintain both copies (i.e. `tweets.json` and `tweets(1).json`).

I used [Lodash](https://lodash.com/docs/4.17.5) - specifically the `pick` function to isolate the subset of attributes we want to export.

I used [download.js](https://github.com/rndme/download) to facilitate triggering file downloads in browser via JavaScript. Under the hood, the library works by appending an `<a>` tag on the page and triggers a `click` event using JavaScript.

##### Where would it be better to place the CSV conversion code, in the node server or in an Angular controller? Why?

The answer to this largely depends on the requirements of the application. I've personally implemented this code in both client and server environments. Generally I would argue it's best to place this code on the server for the following reasons:

- More graceful exception handling
- Enables robust sanitization of data by other services
- Increased data security

Despite the above reasons, I elected to implement this feaure on the client. This was done primarily for simplicity and to reduce unnecessary API calls.

Expected Behavior:
- The `Export` button is disabled by default.
- The user querys for tweets.
- When the query has finished, the `Export` button is enabled, thus allowing the user to download the data that's already stored in-memory in the browser.

I chose this approach because it required the fewest changes across the Lab 05 codebase. Had I elected to place the conversion code on the server I would have to define an additional API interface and wire that up to the client. It was simpler to use the data already fetched by the client and leave the server code as-is.

#### Lab 05 README
The Node [File System](https://nodejs.org/api/fs.html) was used to write the `tweets.json` file containing the data pulled from the Twitter API.

[Nodemon](https://github.com/remy/nodemon) is used to run the server. Nodemon enables live-reloading of the server on code changes, which is very helpful during development.

The [node-twitter](https://github.com/desmondmorris/node-twitter) library was used to interface with live Twitter streams.

The [dotenv](https://www.npmjs.com/package/dotenv) library was used to manage environment variables, like the port number and the Twitter API credentials.

[socket.io](https://github.com/socketio/socket.io) was used to stream tweets collected on the server to the client application. The [socket.io-client](https://github.com/socketio/socket.io-client) library was used in the client code to interface with the server's WebSocket.

[QS](https://www.npmjs.com/package/qs) was used in conjunction with the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to send the user parameters to the server. Specifically, the Fetch API does not enable users to send a JavaScript object as a set of query parameters - the parameters must be stringified and concatenated with the API Endpoint. QS is used to generate a query string from a JavaScript object, bypassing this shortcoming of the Fetch API.

Deploy Instructions

- Install dependencies with `npm install`

- Run the server with the command `npm start`.

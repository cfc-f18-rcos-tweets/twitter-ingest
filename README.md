#### IBM Hackathon Twitter Ingest

**Deploy Instructions**

- Install dependencies with `npm install`

- Start MongoDB + MongoExpress + Jupyter Notebook with `docker-compose up -d`

- Run the server with the command `npm start`.

- View the application at `localhost:3000` and the MongoExpress admin interface at `localhost:8081`

**Notes:**

I used [mongoose](https://github.com/Automattic/mongoose) as a means to connect with MongoDB and define a schema for the tweets data we want to store in Node.js.

When querying for tweets, I pull the data from MongoDB in descending order of `createdAt` so the newest tweets in the database will be displayed first.

The logic for streaming the Tweets from Twitter and formatting them has been moved into `tweets.controller.js`.
'use strict';

// Load .env files from root based on the NODE_ENV value
require('dotenv').load();

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// View the most recent failed tweets
var params = {
    screen_name: process.env.USER_NAME,
    count: 100 // max
},
tweet;

client.get('statuses/user_timeline', params, function(error, tweets) {
    if (!error) {
        for (var i = 0, n = tweets.length; i < n; i++) {
            tweet = tweets[i];
            if (tweet.favorite_count < 1) {
                console.log(tweet.text);
            }
        }
    }
});

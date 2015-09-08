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

var userPath = '/statuses/user_timeline',
    mentionsPath = '/statuses/mentions_timeline';

var params = {
    screen_name: process.env.USER_NAME,
    count: 100
};

// Check our rate limit requests remaining first
client.get('application/rate_limit_status',
{ resources: 'statuses' },
function(err, data) {

    if (!err) {
        var stats = data.resources.statuses,
            userLeft = stats[userPath].remaining,
            mentionsLeft = stats[mentionsPath].remaining;

        console.log('User Requests Left =', userLeft);
        console.log('Mentions Requests Left =', mentionsLeft);

        if (userLeft === 0 || mentionsLeft === 0) {
            console.log('Rate limit exceeded. Try again in 15 minutes.');
            process.exit(0);
        }
    }

});

// A flag for if every test for failure happens
var failed = false;

// Get all the mentions up front
client.get(mentionsPath, params, function(err, mentions) {
    if (!err) {
        console.log('Nobody favorited/retweeted/replied to these tweets:');
        console.log();

        // Get the most recent tweets
        client.get(userPath, params, function(err2, tweets) {
            if (!err2) {

                // Loop through the tweets
                for (var i = 0, n = tweets.length; i < n; i++) {

                    // Check if tweet wasn't favorited or retweeted
                    // and wasn't just a reply to someone
                    if (tweets[i].favorite_count === 0 &&
                        tweets[i].retweet_count === 0 &&
                        tweets[i].in_reply_to_status_id_str === null) {

                        // Loop through the mentions
                        for (var i2 = 0, n2 = mentions.length; i2 < n2; i2++) {

                            // Check if the tweet was in any mentions
                            if (tweets[i].id_str ===
                                mentions[i2].in_reply_to_status_id_str) {

                                // Don't count replying to yourself
                                if (mentions[i2].in_reply_to_user_id_str ===
                                    mentions[i2].user.id_str) {

                                    failed = true;
                                    break;
                                }
                            }

                        }

                        if (failed) {
                            console.log('https://twitter.com/' +
                                process.env.USER_NAME + '/status/' +
                                tweets[i].id_str);

                            console.log(tweets[i].text);
                            console.log();
                        }
                    }
                }
            }
        });

    }
});

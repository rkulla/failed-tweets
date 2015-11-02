'use strict';

// Load .env files from root based on the NODE_ENV value
require('dotenv').load();

let Twitter = require('twitter');

let client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const USERPATH = '/statuses/user_timeline',
    MENTIONSPATH = '/statuses/mentions_timeline';

// Check our rate limit requests remaining first
client.get('application/rate_limit_status',
{ resources: 'statuses' }, (err, data) => {

    if (!err) {
        let stats = data.resources.statuses,
            userLeft = stats[USERPATH].remaining,
            mentionsLeft = stats[MENTIONSPATH].remaining;

        if (userLeft === 0 || mentionsLeft === 0) {
            console.log('Rate limit exceeded. Try again in 15 minutes.');
            process.exit(0);
        }
    }

});

function getMentions() {
    return new Promise((resolve, reject) => {
        let params = {
            count: 100
        };

        client.get(MENTIONSPATH, params, (err, mentions) => {
            if (!err) {
                resolve(mentions);
            }
        });
    });
}

function getTweets(mentions) {
    return new Promise((resolve, reject) => {
        let params = {
            screen_name: process.env.USER_NAME,
            count: 100
        };

        client.get(USERPATH, params, (err, tweets) => {
            if (!err) {
                resolve([tweets, mentions]);
            }
        });
    });
}

getMentions()
.then(mentions => getTweets(mentions))
.then(promiseValues => {
    let tweets = promiseValues[0],
        mentions = promiseValues[1];

    // A flag for if every test for failure happens
    let failed = false;

    console.log('Nobody favorited/retweeted/replied to these tweets:');
    console.log();
    // Loop through the tweets
    for (let i = 0, n = tweets.length; i < n; i++) {

        // Check if tweet wasn't favorited or retweeted
        // and wasn't just a reply to someone
        if (tweets[i].favorite_count === 0 &&
            tweets[i].retweet_count === 0 &&
            tweets[i].in_reply_to_status_id_str === null) {
               failed = true;

            // Loop through the mentions
            for (let i2 = 0, n2 = mentions.length; i2 < n2; i2++) {

                // Check if the tweet was in any mentions
                if (tweets[i].id_str ===
                    mentions[i2].in_reply_to_status_id_str) {

                    // Don't count replying to yourself
                    if (mentions[i2].in_reply_to_user_id_str !==
                        mentions[i2].user.id_str) {

                        failed = true;
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
})
.catch(reason => {
    console.log('Caught Error:', reason);
});

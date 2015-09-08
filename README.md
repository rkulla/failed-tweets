Failed-tweets is a simple command line app that shows you any tweets that you,
or your organization, didn't get any favorites, retweets, or replies to.

Of course, these aren't really "failed" tweets, but if might be if you were
aiming for a response and didn't get one.

This can be useful for helping you decide to try tweeting those tweets again
or just deleting them.

Note that it doesn't take into account if there was a lot of activity on a
tweet, which might still mean people read it or clicked it. So take this
with a grain of salt.

### Usage
Create a file called .env in the root of this project directory and add:

    # Twitter OAuth credentials
    CONSUMER_KEY=
    CONSUMER_SECRET=
    ACCESS_TOKEN_KEY=
    ACCESS_TOKEN_SECRET=

    # Twitter user to view
    USER_NAME=rkulla

Fill in the values with your twitter credentials by going to 
https://apps.twitter.com/app/new and creating a `failed-tweets` 
app with read/write perms.


Run the program with:

    $ node index.js

Failed-tweets is a simple command line app that shows you any tweets that you
or your organization didn't get any favorites, retweets, or replies to.

Of course, these aren't necessarily failed tweets but might be considered so
if you were aiming for an interaction and didn't get one.

This information can be helpful for knowing what to tweet again or delete.

Note that it doesn't take into account if there was a lot of activity on a
tweet, which might mean that some people still read or clicked it. So take 
this data with a grain of salt.

### Usage
Create a file called .env in the root of this project directory and add:

    # Twitter OAuth credentials
    CONSUMER_KEY=
    CONSUMER_SECRET=
    ACCESS_TOKEN_KEY=
    ACCESS_TOKEN_SECRET=

    # Twitter user to view
    USER_NAME=

Fill in the values with your twitter credentials by going to 
https://apps.twitter.com/app/new and creating a `failed-tweets` 
app with read/write perms.

Run the program with:

    $ node index.js

If you're using a version older than node 4.0.0, then consider
using nvm to also install node 4 or you can use the included
babel compiled version that downgrades from es6 to es5:

    $ node build/index.js

### Output
In your terminal, a list of your tweets will be displayed.
In your web browser, the data will be displayed at this address.
```
    Express started on http://localhost:3000
```

### Note
Web output, has been improved with Google's MDL (material-design-lite - https://github.com/google/material-design-lite ).



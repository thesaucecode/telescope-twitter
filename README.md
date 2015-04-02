# telescope-twitter

## Overview

This is a package written for the [telescope project](http://www.telesc.pe/).  It provides twitter integration such that admin users can tweet links to telescope posts on their communities twitter page.

## Set up twitter application

1. Go to [Twitter Apps](https://apps.twitter.com/)
2. If you have not already configured a twitter application for accounts-twitter already, create a twitter account and application for your community.
3. Check that your app and access token have read and write access.  If your token is read only after updating your app to 'read-write', you will need to recreate your access token

## Implementation

1. Clone this repo to your `packages/` directory
2. On the command line, run `meteor add telescope-twitter` to activate the package for use on your telescope installation
3. Set the following 4 environment variables before running meteor in dev or production

````
	CONSUMER_KEY=XXX
	CONSUMER_SECRET=XXX
	ACCESS_TOKEN=XXX
	ACCESS_TOKEN_SECRET=XXX
````	

#### Why environment variables?

Think of your keys as usernames and your secrets as passwords to the twitter API for your account.  As you wouldn't store your account password in plaintext within your codebase, we don't support the same storage of these sensitive credentials either.

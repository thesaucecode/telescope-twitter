var Future = Npm.require('fibers/future');

var environmentVarsRequired = [
  'CONSUMER_KEY',
  'CONSUMER_SECRET',
  'ACCESS_TOKEN',
  'ACCESS_TOKEN_SECRET'
];

var allNecessaryKeysAvailable = function() {
  return _.reduce(_.map(environmentVarsRequired, function(envVar) {
    return !_.isUndefined(process.env[envVar]) && !_.isEmpty(process.env[envVar]);
  }), function(memo, item) {
    return memo && item;
  }, true);
};

var reportAPIConnectionNotPossible = function(method) {
  var message = '';
  if (!_.isUndefined(method)) {
    message += 'Could not perform API method [ ' + method + ' ].  Reason: ';
  }
  message = "Cannot connect to twitter API as the following environment variables are not available: [ "
    + environmentVarsRequired.join(', ') + " ]";
  console.log(message);
};

var getForwardSlashedRootUrl = function() {
  var url = process.env.ROOT_URL;
  return url.match(/\/$/) === null ? (process.env.ROOT_URL + "/") : process.env.ROOT_URL;
};

var getTwitterHandle = function(twitter) {
  return twitter.match(/^@/) ? twitter : "@" + twitter;
};

var postToTweet = function(post) {
  var status = post.title + ': ';
  var user = Meteor.users.findOne({_id: post.userId});
  if (!_.isUndefined(post.tagline)) {
    status += post.tagline;
  }
  if (!_.isUndefined(post.url)) {
    status += ' ' + getForwardSlashedRootUrl() + "posts/" + post._id;
  }
  if (user && !user.isAdmin && user.profile && user.profile.twitter && user.profile.twitter.length + status.length < 134) {
    status += ' via ' + getTwitterHandle(user.profile.twitter);
  }
  return status;
};

var TwitterAPI = null;

var twitterAPIMethods = {
  'SendToAPI': function(method, params, callback) {
    if (TwitterAPI === null) {
      reportAPIConnectionNotPossible(method);
    } else {
      var fut = new Future();
      var bound_callback = Meteor.bindEnvironment(function (err, res) {
        if (err) {
          fut.throw(err);
        } else {
          if (!_.isUndefined(callback)) {
            callback();
          }
          fut.return(res);
        }
      });
      // Actually hit the API now
      TwitterAPI.post(method, params, bound_callback);
      fut.wait();
    }
  },
  'TweetPost': function(post) {
    if (TwitterAPI === null) {
      reportAPIConnectionNotPossible(method);
    } else {
      twitterAPIMethods.SendToAPI('statuses/update', { status: postToTweet(post) }, function() {
        var tweetCount = post.tweetCount || 0;
        tweetCount++;
        Posts.update({_id: post._id}, {$set: {tweetCount: tweetCount}});
      });
    }
  }
};

Meteor.startup(function() {
  if (allNecessaryKeysAvailable()) {
    var options = {};
    _.each(environmentVarsRequired, function(envVar) {
      options[envVar.toLowerCase()] = process.env[envVar];
    });
    // Create twitter API client
    TwitMaker = Npm.require('twit');
    TwitterAPI = new TwitMaker(options);
  } else {
    reportAPIConnectionNotPossible();
  }
  Meteor.methods(twitterAPIMethods);
});

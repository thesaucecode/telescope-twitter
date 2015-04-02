postMeta.push({
  template: 'postTweet',
  order: 60
});

Template[getTemplate('postTweet')].helpers({
  tweetCount: function() {
    return this.tweetCount || 0;
  }
});

Template[getTemplate('postTweet')].events({
  'click a.tweet-post': function(event, template) {
    var post = this;
    Meteor.call('TweetPost', post, function(err, result) {
      if (err) {
        console.log('could not post tweet: ' + err);
      }
    });
  }
});

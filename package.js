Package.describe({
  summary: 'Share posts on your communities twitter account',
  version: '0.0.2',
  name: 'telescope-twitter'
});


Package.onUse(function (api) {
  
  Npm.depends({
    'twit': '1.1.20'
  });

  api.use([
    'tap:i18n',
    'telescope-base',
    'telescope-lib',
    'underscore',
    'telescope-i18n',
    'templating'
  ]);


  // i18n config (must come first)

  api.add_files([
    'package-tap.i18n'
  ], ['client', 'server']);

  api.add_files([
    'lib/posts_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/start.js'
  ], ['server']);

  api.addFiles([
    'lib/client/post_tweet.html',
    'lib/client/post_tweet.js'
  ], ['client']);

  // i18n languages (must come last)
  api.add_files([
    'i18n/en.i18n.json'
  ], ['client', 'server']);


  api.export([
    'TwitterAPI',
    'addToPostSchema'
  ]);
});

var tweetCount = {
  propertyName: 'tweetCount',
  propertySchema: {
    type: Number,                   // property type
    optional: true,
    autoform: {
      omit: true                     // set to true to omit field from form entirely
    }
  }
};

addToPostSchema.push(tweetCount);
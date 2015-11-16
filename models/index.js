var Promise = require('bluebird');
// pull in the Sequelize library
var Sequelize = require('sequelize');
// create an instance of a database connection
// which abstractly represents our app's mysql database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {
    dialect: "mysql",
    port:    3306
});
// open the connection to our database
twitterjsDB
  .authenticate()
  .catch(function(err) {
    console.err('Unable to connect to the database:', err);
  })
  .then(function() {
    console.log('Connection has been established successfully.');
  });

  // set up interface for DBs
  var Tweet = require('./tweet')(twitterjsDB),
    User = require('./user')(twitterjsDB);

  // adds a UserId foregn key to the `Tweet` table
  User.hasMany(Tweet);
  Tweet.belongsTo(User);

  // returns array of tweet objects with only text, name, id keys
  function parseTweets(tweets) {
    return tweets.map(function(tweet){
      return {
        id: tweet.id,
        name: tweet.User.name,
        text: tweet.tweet
      }
    })
  }

  var find = function(query){
    return User.findOne({
      include: {all: true},
      where: query
    });
  };

  var list = function(){
    return Tweet.findAll({include:[{all:true}]})
    .then(function(tweets){
      return parseTweets(tweets);
    });
  }

  var add = function(name, text){
    return find({name: name})
      .then(function resolve(user){
        if (!user)
          return User.create({name: name})
          .then(function resolve(user) {
            Tweet.create({tweet: text, UserId: user.id});
          })
        return Tweet.create({tweet: text, UserId: user.id});
      });
  }

module.exports = {
  User: User,
  Tweet: Tweet,
  list: list,
  add: add,
  find, find
};

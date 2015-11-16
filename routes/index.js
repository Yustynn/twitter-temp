var express = require('express');
var router = express.Router();

// could use one line instead: var router = require('express').Router();
var tweetBank = require('../models');

router.get('/', function (req, res) {
  tweetBank.list().then(function resolve(tweets){
    res.render( 'index', { title: 'Twitter.js', tweets: tweets } );
  });

});

function getTweet (req, res){
  tweetBank.find(req.params)
  .then(function resolve(user){
    var tweets = user.Tweets.map(function(tweet){
      return {
        id: tweet.id,
        text: tweet.tweet
      }
    });
    res.render('index', { tweets: tweets });
  });
}

// User.tweets

router.get('/users/:name', getTweet);
router.get('/users/:name/tweets/:id', getTweet);

// note: this is not very REST-ful. We will talk about REST in the future.
router.post('/submit', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;
  tweetBank.add(name, text)
  .then(console.log);

  console.log('done')
  res.redirect('/');
});

module.exports = router;

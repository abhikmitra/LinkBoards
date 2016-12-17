var express = require('express');
var router = express.Router();
var watsonURLAnalyzer = require('../helpers/urlAnalyzer.js');
var graphHelper = require('../helpers/graphHelper.js');
var emailHelper = require('../helpers/emailHelper.js');
var recommendationHelper = require('../helpers/recommendationHelper.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//This is beiing used
router.post('/postURL', function(req, res, next) {
  var urlToBePosted = req.body.url;
  return watsonURLAnalyzer.analyzeUrl(urlToBePosted).then(function (response) {
    return res.json({success : true, data : response});
  }, function(err){
    return res.json({ success : false, error : err});
  })
});


router.get('/analyzeURLTest', function (req, res, next) {
  return watsonURLAnalyzer.analyzeUrl(null, true).then(function (response) {
    return res.json({success : true, data : response});
  }, function(err){
    return res.json({ success : false, error : err});
  })
})


router.post('/recommendations', function (req, res, next) {
  return recommendationHelper.searchInElasticSearch(req.body["tags[]"], req.body.title).then(function (response) {
    return res.json({success : true, data : response});
  }, function(err){
    return res.json({ success : false, error : err});
  })
})


router.post('/postToGroup', function (req, res, next) {
  emailHelper.generateEmail(req.body).then(function (html) {
    req.body.html = html;
    graphHelper.postToGroup(req.body.accessToken, req.body).then(function (response) {
      return res.json({success : true, data : response});
    }, function (err) {
      return res.json({ success : false, error : err});
    })

  });
})

module.exports = router;

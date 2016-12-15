var express = require('express');
var router = express.Router();
var watsonURLAnalyzer = require('../helpers/urlAnalyzer.js');
var graphHelper = require('../helpers/graphHelper.js');
var emailHelper = require('../helpers/emailHelper.js');
// var msGraphClient = require('../helpers/msgraphclient.js');

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


router.post('/postToGroup', function (req, res, next) {
  emailHelper.generateEmail(
      req.body["tags[]"],
      req.body.title,
      req.body.preview,
      req.body.url ,
      req.body.additionalText).then(function (text) {

    graphHelper.postToGroup(text, req.body.groupId, req.body.accessToken).then(function (response) {

      return res.json({success : true, data : response});
    }, function () {
      return res.json({ success : false, error : err});
    })

  });

})


// router.get('/testgrouppost', function(req, res, next){
//   return msGraphClient.postToGroup("test post").then(function(res){
//     return res.json({success : true});
//   }, function(err){
//     return res.json({success : false})
//   })
// })

module.exports = router;

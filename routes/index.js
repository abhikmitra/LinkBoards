var express = require('express');
var router = express.Router();
var watsonURLAnalyzer = require('../helpers/urlAnalyzer.js');
// var msGraphClient = require('../helpers/msgraphclient.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postURL', function(req, res, next) {
  var urlToBePosted = req.body.url;
  return watsonURLAnalyzer.analyzeUrl(urlToBePosted).then(function (response) {
    return res.json({success : true, data : response});
  }, function(err){
    return res.json({ success : false, error : err});
  })
})

router.get('/analyzeURLTest', function (req, res, next) {
  return watsonURLAnalyzer.analyzeUrl(null, true).then(function (response) {
    return res.json({success : true, data : response});
  }, function(err){
    return res.json({ success : false, error : err});
  })
})

// router.get('/testgrouppost', function(req, res, next){
//   return msGraphClient.postToGroup("test post").then(function(res){
//     return res.json({success : true});
//   }, function(err){
//     return res.json({success : false})
//   })
// })

module.exports = router;

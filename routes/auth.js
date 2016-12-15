/**
 * Created by abhikmitra on 12/15/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'ShareIt' });
});

module.exports = router;
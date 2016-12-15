/**
 * Created by abhikmitra on 12/15/16.
 */
var express = require('express');
var router = express.Router();
var authHelper = require('../authHelper');
/* GET home page. */
router.get('/login', function(req, res, next) {
    if (req.query.code !== undefined) {
        authHelper.getTokenFromCode(req.query.code, function (e, accessToken, refreshToken) {
            if (e === null) {
                // cache the refresh token in a cookie and go back to index
                res.cookie(authHelper.ACCESS_TOKEN_CACHE_KEY, accessToken);
                res.cookie(authHelper.REFRESH_TOKEN_CACHE_KEY, refreshToken);
                res.redirect('/auth/communicateCredsToPlugin');
            } else {
                console.log(JSON.parse(e.data).error_description);
                res.status(500);
                res.send();
            }
        });
    } else {
        res.render('login', {
            title: 'ShareIt',
            data : {
                auth_url: authHelper.getAuthUrl()
            }
        });
    }

});

router.get('/communicateCredsToPlugin', function(req, res, next) {
    res.render('creds', {
        title: 'Logging in'
    });
});
module.exports = router;
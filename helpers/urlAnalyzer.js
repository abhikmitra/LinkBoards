/**
 * Created by abhikmitra on 12/15/16.
 */
var Q = require('q');
var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
    // api_key: '8da9c35b8557581b14e0cb194ed349eba2a1321d'
    api_key: '1dc27ccd04df437d7e5fd3ca1aabf283ff7f0afc'
});
var extractParams = 'title,authors,keywords,concepts,taxonomy,doc-sentiment,doc-emotion,page-image,image-kw';

function analyzeUrl(url, isTest) {
    var deferred = Q.defer();
    url = isTest ? 'http://thewire.in/86863/the-poor-are-paying-for-the-demonetisation/' : url;
    var parameters = {
        extract: extractParams,
        url: url,
        showSourceText: 1
    };
    alchemy_language.combined(parameters, function (err, response) {
        if (err) {
            console.log('error:', err);
            deferred.reject("Unable to analyze URL using watson api ", err);
        }
        else {
            console.log(JSON.stringify(response, null, 2));
            response.requestURL = url;
            deferred.resolve(response);
        }
    });
    return deferred.promise;
}

module.exports = {
    analyzeUrl : analyzeUrl
}
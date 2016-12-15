/**
 * Created by abhikmitra on 12/15/16.
 */
var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
    api_key: '8da9c35b8557581b14e0cb194ed349eba2a1321d'
});

var parameters = {
    extract: 'title,authors,keywords,concepts,taxonomy',
    url: 'http://thewire.in/86863/the-poor-are-paying-for-the-demonetisation/'
};

alchemy_language.combined(parameters, function (err, response) {
    if (err)
        console.log('error:', err);
    else
        console.log(JSON.stringify(response, null, 2));
});
/**
 * Created by abhikmitra on 12/16/16.
 */
var Q = require("q");
var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path')

var templateDir = path.join(__dirname, '../templates', 'welcome-email')
var welcomeEmail = new EmailTemplate(templateDir)
function generateEmail(metadata) {
    var deferred = Q.defer();
    var combinedTags = metadata["tags[]"].join(",");
    welcomeEmail.render({
        title: metadata.title,
        text: metadata.preview,
        url: metadata.requestURL,
        tags:combinedTags,
        image:metadata.image
    }, function (err, result) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(result.html);

    })
    return deferred.promise;
}





module.exports =  {
    generateEmail : generateEmail,
}

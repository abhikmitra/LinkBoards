/**
 * Created by abhikmitra on 12/16/16.
 */
var request = require("request");
var Q = require("q");

module.exports =  {
    postToGroup : postToGroup
}

function postToGroup(accessToken, data) {
    var deferred = Q.defer();
    var body = {
        "topic": data.title != null ? data.title.substr(0, 100) + "..." : data.title,
        "threads": [{
            "posts": [{
                "body": {
                    "contentType": "html",
                    "content": data.html
                },
                "newParticipants": []
            }]
        }]
    };
    var headers = {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    }


    var options = {
        uri: 'https://graph.microsoft.com/v1.0/groups/' + data.groupId + '/conversations',
        method: 'POST',
        json: body,
        headers : headers
    };

    request(options, function (error, response, body) {
        if (!body.error && !error) {
            console.log(body.id) // Print the shortened url.
            return deferred.resolve(body);
        }
        deferred.reject(error);
    });
    return deferred.promise;
}
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
    var groupIds = data["groupIds[]"];
    if (!groupIds || groupIds.length == 0) {
        return deferred.promise.reject("No group ids were passed to post");
    }
    var result = [];
    var deferredArray = [];
    groupIds.forEach(function(groupId){
        deferredArray.push(postLinkToGroup(groupId, accessToken, data));
    });
    Q.allSettled(deferredArray).then(function (values) {
        for (i=0; i< values.length ; i++) {
            if (values[i].state == "fulfilled") {
                result.push({groupId : groupIds[i], success : true});
            } else {
                result.push({ groupId: groupIds[i], success : false, reason: values[i].reason})
            }
        }
        deferred.resolve(result);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

function postLinkToGroup(groupId, accessToken, post) {
    var deferred = Q.defer();
    var body = {
        "topic": post.title != null ? post.title.substr(0, 100) + "..." : post.title,
        "threads": [{
            "posts": [{
                "body": {
                    "contentType": "html",
                    "content": post.html
                },
                "newParticipants": []
            }]
        }]
    };
    var headers = {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
    };
    var options = {
        uri: 'https://graph.microsoft.com/v1.0/groups/' + groupId + '/conversations',
        method: 'POST',
        json: body,
        headers : headers
    };

    request(options, function (error, response, body) {
        if (!body.error && !error) {
            console.log(body.id) // Print the shortened url.
            return deferred.resolve(body);
        }
        if(body.error) {
            return deferred.reject(body.error.code);
        }
        deferred.reject(error);
    });
    return deferred.promise;
}
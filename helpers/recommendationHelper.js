/**
 * Created by abhikmitra on 12/17/16.
 */
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: "https://paas:01c1bbaf08bca248acae78e32a474e3c@dori-us-east-1.searchly.com",
    requestTimeout: 60000,
    sniffOnStart: true
});
var Q = require("q");
var _ = require('lodash');

function indexInElastic(url, title, tags) {
    var deferred = Q.defer();
    process.nextTick(function () {

        if(_.isEmpty(tags)) {
            return Q.when([]);
        }
        client.index({
            index: 'url',
            type: 'Object',
            tags: tags,
            body: {
                url:url,
                title: title,
                tags: tags,
                published: true,
            }
        }, function (error, response) {
            if(error) {
                deferred.reject(error);
            }

            return deferred.resolve(tags);
        });
    });

    return deferred.promise;
}


function searchInElasticSearch(tags, title) {
    var deferred = Q.defer();
    process.nextTick(function () {
        var q = tags.join(" | ");
        if (q.trim() !== "") {
            client.search({
                index: 'url',
                size: 10,
                type: 'Object',
                body: {
                    query: {

                        simple_query_string: {
                            query: q,
                            fields: ["_all"],
                        }
                    }
                }
            }).then(function (resp) {
                var hits = resp.hits.hits;
                return deferred.resolve(_.map(hits, function (el) {
                    return el._source;
                }));
            }, function (err) {
                console.trace(err.message);
                return deferred.reject(err);

            });
        } else {
            deferred.resolve([]);
        }
    });
    return deferred.promise;
}

module.exports = {
    indexInElastic: indexInElastic,
    searchInElasticSearch: searchInElasticSearch,
}

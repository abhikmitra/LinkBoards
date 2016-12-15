/**
 * Created by Naveen on 15/12/16.
 */
const MicrosoftGraph = require("msgraph-sdk-javascript");
var Q = require("q");
const access_token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFEUk5ZUlEzZGhSU3JtLTRLLWFkcENKTXZsR0NyT1BPcjNJSUdlWGE2VDRkd1JFZFFtenlfRVZQOXRURDVfYUlCLVVmMzVzLVRQcUhiWUlMZTJVQVRZVkh5dTdtLUhmc1ZFRlpFNm81NUxPVVNBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiUnJRcXU5cnlkQlZSV21jb2N1WFViMjBIR1JNIiwia2lkIjoiUnJRcXU5cnlkQlZSV21jb2N1WFViMjBIR1JNIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mM2QxMTk4My0xOGNhLTQ3OWQtOWU4ZS0xNDJkMzNkZTYwZTEvIiwiaWF0IjoxNDgxODAyOTUwLCJuYmYiOjE0ODE4MDI5NTAsImV4cCI6MTQ4MTgwNjg1MCwiYWNyIjoiMSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiU2hhcmVJdCIsImFwcGlkIjoiMDAxMGI1OTMtYzg3Ny00NmEyLWJhN2EtN2M5YTVjZGNmODA1IiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJsYXN0IiwiZ2l2ZW5fbmFtZSI6InRlc3QiLCJpcGFkZHIiOiIxNjcuMjIwLjIzOC4zOSIsIm5hbWUiOiJ0ZXN0IGxhc3QiLCJvaWQiOiJjYTRhNzUwZi0wZjg0LTRkYWUtYjBlYi1hNTI2YTI5OGM5YjgiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzNGRkY5Q0M5REYyOSIsInNjcCI6Ikdyb3VwLlJlYWRXcml0ZS5BbGwgTWFpbC5TZW5kIFVzZXIuUmVhZCIsInN1YiI6IlFzSlVmelZFcGpCN2tLR3dHWGtHd205MmoyVmR1TkhjSjN1N1dwYjNRcjQiLCJ0aWQiOiJmM2QxMTk4My0xOGNhLTQ3OWQtOWU4ZS0xNDJkMzNkZTYwZTEiLCJ1bmlxdWVfbmFtZSI6InVzZXJhZG1pbkBndWVzdDEyMy5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJ1c2VyYWRtaW5AZ3Vlc3QxMjMub25taWNyb3NvZnQuY29tIiwidmVyIjoiMS4wIn0.BzKL-59A_sjkGW3nL6rtsuCOycrb35vNiT4bdAZC8ecrVRk2Z8JSnmm5HbpqgrJODMGYqixyqGNFyTlGRWO_MbI9wGuU69wSmj8FKEZ20W792ZBl6c67UVXeFPSU-BCShteanqjcjnKHUIRtmjvUgqJTa0bN4hEAhX7dasBNh-RAzZp2b6vsodfvC6DfR2AnYxb5VCqYKvjztJ2btUQKgh_JaiSs3pWuvizT-btOeKF06TS3bnD1fgJm-bwZu1AAwlJv4UxVBdzGnmJsAyhomLcP_F9ThuC7WvdZ2YOM6ctPtXN3R6L_KnaZyqjOgVsG_nAPOZI9Kwd5_UYpUZDiXQ";
var request = require("request");

function postToGroup(text) {
    var deferred = Q.defer();
    var groupId = "ad11f0b3-cd2f-48ac-b4a1-027e5baea086";
    var message = {
        "topic": "Testing Topic",
        "threads": [{
            "posts": [{
                "body": {
                    "contentType": "html",
                    "content": "this is body content"
                },
                "newParticipants": [{
                    "emailAddress": {
                        "name": "Alex Darrow",
                        "address": "alexd@contoso.com"
                    }
                }]
            }]
        }]
    };
    var options = {
        uri: 'https://graph.microsoft.com/v1.0/groups/' + groupId + '/conversations',
        method: 'POST',
        json: message,
        headers : {
            "Authorization" : "Bearer "+access_token,
            "Content-Type": "application/json"
        }
    };

    request(options, function (error, response, body) {
        if (!error) {
            console.log(body.id) // Print the shortened url.
            return deferred.resolve(body);
        }
        deferred.reject(error);
    });
    return deferred.promise;

}

function createGroup() {

}

module.exports =  {
    postToGroup : postToGroup,
    createGroup: createGroup
}
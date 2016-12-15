/**
 * Created by abhikmitra on 02/02/16.
 */
window.widgets = window.widgets || {};

window.widgets.getCredsFromCookies = function(data){
    chrome.tabs.query({
        active:true
    }, function (tab) {
        debugger;
    });

    if(data.ACCESS_TOKEN_CACHE_KEY) {
        var o365Data = data;
        getUserDetails(data.ACCESS_TOKEN_CACHE_KEY).then(function (userData) {
            o365Data.displayName = userData.displayName;
            o365Data.mail = userData.mail;
            o365Data.userPrincipalName = userData.userPrincipalName;
            chrome.storage.sync.set({'o365Data': o365Data}, function() {

            });
        });

    } else {

    }
}

function getUserDetails(accessToken) {
    return $.ajax({
        url: "https://graph.microsoft.com/v1.0/me/",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.storage.sync.get('o365Data', function(info) {
        if(info.o365Data && info.o365Data.ACCESS_TOKEN_CACHE_KEY) {

        } else {
            chrome.tabs.create({
                url: 'http://localhost:3000/auth/login'
            });
        }
    })

})
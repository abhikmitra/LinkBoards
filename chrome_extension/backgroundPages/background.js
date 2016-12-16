/**
 * Created by abhikmitra on 02/02/16.
 */
window.widgets = window.widgets || {};


chrome.runtime.onInstalled.addListener(function(tab) {
    createNotifications();
    chrome.storage.sync.get('o365Data', function(info) {
        if(info.o365Data && info.o365Data.ACCESS_TOKEN_CACHE_KEY) {

        } else {
            chrome.tabs.create({
                url: 'http://localhost:3000/auth/login'
            });
        }
    })
});

function createNotifications(groupEmail, userEmail, title) {
    // chrome.notifications.create(
    //     'notify1', {
    //         type: chrome.notifications.TemplateType.IMAGE,
    //         iconUrl: "icon.png",
    //         imageUrl: "icon.png",
    //         title: "Posted!",
    //         message: "Your link has been posted to group name",
    //         contextMessage: "The title of the link",
    //         priority: 2
    //         // buttons: [{
    //         //     title: "See post",
    //         //     iconUrl: "https://cdn4.iconfinder.com/data/icons/eldorado-mobile/40/eye_2-512.png"
    //         // },
    //         //     {
    //         //         title: "Show Links",
    //         //         iconUrl: "https://cdn4.iconfinder.com/data/icons/web-links/512/41-512.png"
    //         //     }
    //         // ]
    //
    //     }, function (notificationId) {
    //
    //         setTimeout(function() {
    //             chrome.notifications.clear(notificationId, function(wasCleared) {
    //                 debugger;
    //                 console.log(wasCleared);
    //             });
    //         }, 4000);
    //         debugger;
    //     });



    
}

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
            getGroupDetails(data.ACCESS_TOKEN_CACHE_KEY).then(function (data) {
                debugger;
                o365Data.groups = data.value;
                chrome.storage.sync.set({'o365Data': o365Data}, function() {
                    chrome.tabs.query({url:[
                        "http://*.herokuapp.com/*",
                        "http://*.localhost:*/*"
                    ]}, function callback(data){

                        data.forEach(function(tab){
                            chrome.tabs.remove(tab.id);
                        });
                    });
                });
            });

        });

    } else {
        chrome.tabs.query({url:[
            "http://*.herokuapp.com/*",
            "http://*.localhost:*/*"
        ]}, function callback(data){

            data.forEach(function(tab){
                chrome.tabs.remove(tab.id);
            });
        });
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

function getGroupDetails(accessToken) {
    return $.ajax({
        url: "https://graph.microsoft.com/v1.0/groups/",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {



})
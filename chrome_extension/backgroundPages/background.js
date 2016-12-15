/**
 * Created by abhikmitra on 02/02/16.
 */
window.widgets = window.widgets || {};

window.widgets.login = function(data){
    var message="",
        url = '/views/login.html';
    if(data.message) {
        url +="?message=" + data.message;
    }
    chrome.tabs.create({
        url: url
    });
}

chrome.browserAction.onClicked.addListener(function(tab) {

    chrome.storage.sync.get('o365Info', function(info) {
        debugger;
        if(info.o365Info && info.o365Info.token) {
            chrome.tabs.create({
                url: '/views/connectWithOffice365.html'
            });
        } else {
            chrome.tabs.create({
                url: '/views/connectWithOffice365.html'
            });
        }
    })

})
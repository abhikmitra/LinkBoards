/**
 * Created by abhikmitra on 31/01/16.
 */
var communication = {
    send : function(objectName,functionName, data){
        var parcel = {
            objectName:objectName,
            functionName:functionName,
            message:data,
            sender:"grouposter"
        }
        if($(".result-frame").length!==0) {
            $(".result-frame").get(0).contentWindow.postMessage(parcel, "*");
        } else {
            window.top.postMessage(parcel, "*");
        }


    },
    receive : function(e) {
        if(!e.data.sender){
            return;
        }
        var objectName = e.data.objectName;
        var functionName = e.data.functionName;
        var message = e.data.message;
        if(window[objectName][functionName]) {
            window[objectName][functionName](message);
        }

    },
    sendToBackGroundPage : function(objectName,functionName, data){
        var parcel = {
            objectName:objectName,
            functionName:functionName,
            message:data,
            sender:"contentScript"
        }
        chrome.runtime.sendMessage(parcel);
    },
    onReceiveChromeMessage : function (e, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        var objectName = e.objectName;
        var functionName = e.functionName;
        var message = e.message;
        if(window[objectName][functionName]) {
            window[objectName][functionName](message);
        }

    }
}
window.onmessage = communication.receive;
chrome.runtime.onMessage.addListener(communication.onReceiveChromeMessage);
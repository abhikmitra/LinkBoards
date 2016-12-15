/**
 * Created by abhikmitra on 12/15/16.
 */
(function () {
   console.log("ol");
    chrome.tabs.query({active:true},function(tabs){
        if (tabs.length > 1) {
           var url = tabs[0].url;
            bookmarkUrl(url)
        }
    });


    function bookmarkUrl(url) {
        
    }
}());
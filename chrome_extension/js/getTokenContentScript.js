/**
 * Created by abhikmitra on 12/15/16.
 */
(function () {

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    var $sendCredsToBackground = $("#sendCredsToBackground");
    if($sendCredsToBackground.length) {

        communication.sendToBackGroundPage("widgets","getCredsFromCookies",{
            ACCESS_TOKEN_CACHE_KEY: readCookie("ACCESS_TOKEN_CACHE_KEY"),
            REFRESH_TOKEN_CACHE_KEY: readCookie("REFRESH_TOKEN_CACHE_KEY"),
        });

        setTimeout(function () {
            window.close();
        }, 1000);
    }


}());
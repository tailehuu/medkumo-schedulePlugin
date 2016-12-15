/*
 * Medkumo Javascript SDK
 *
 */
(function(window, undefined) {
    var Medkumo = {},
        Config = {};

    if (window.Medkumo) {
        return;
    }

    Medkumo.book = function(hospitalKey, doctorKey) {
        console.log('executing book...');
        var date = new Date();
        var session = date.getDate() + "" + date.getMonth() + "" + date.getFullYear();
        PopupCenter('index.html?hospitalKey=' + hospitalKey + '&doctorKey=' + doctorKey + '&session=' + session, "Book An Appointment", 650, 600);
    };

    function PopupCenter(url, title, w, h) {
        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }
    }

    window.Medkumo = Medkumo;
})(this);

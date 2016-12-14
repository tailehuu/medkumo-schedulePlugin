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

    Medkumo.book = function(hospitalKey, doctorKey, env) {
        console.log('executing book...');

        if (typeof(env) == 'undefined') {
            env = 'prod';
        }

        loadConfig(hospitalKey, doctorKey, env);
        loadScript(Config.sdkBaseUrl + '/lib/jquery-medkumo.js', checkHospitalKey);
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


    function checkHospitalKey() {
        console.log('executing checkHospitalKey...');

        var jsonData = {
            "hospital_key": Config.hospitalKey,
            "doctor_key": Config.doctorKey
        };
        Medkumo.jQuery.ajax({
            type: 'POST',
            url: Config.apiCheckHospitalAndDoctorDetails,
            data: JSON.stringify(jsonData),
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
                console.log('success: ', data);
                if (data.code === '1') {
                  PopupCenter('//' + Config.sdkBaseUrl + '/bookAnAppointment.html?hospitalKey=' + Config.hospitalKey + '&doctorKey=' + Config.doctorKey, "Hello", 600, 500);
                } else {
                    alert(data.message);
                    renderMessage.error(data.message, '.medkumo-sdk-message');
                }
            },
            error: function(data) {
                console.log('error: ', data);
            }
        });
    }



    function loadScript(src, callback) {
        console.log('executing loadScript...');

        var script, isReady;
        isReady = false;
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = script.onreadystatechange = function() {
            if (!isReady && (!this.readyState || this.readyState == 'complete')) {
                isReady = true;
                callback();
            }
        };
        document.body.appendChild(script);
    }

    function loadConfig(hospitalKey, doctorKey, env) {
        var sdkBaseUrl = 'file:///D:/PhienNT/PHP/medkumo-schedulePlugin',
            apiBaseUrl = 'http://54.169.72.195/WebAppAPI/doctorApp.php/api/v1/doctor',
            apiCheckHospitalAndDoctorDetails,
            apiDoctorAvailableTiming,
            apiBookAnAppointment;
        if (env == 'prod') {
            apiCheckHospitalAndDoctorDetails = apiBaseUrl + '/checkHospitalAndDoctorDetails';
            apiBookAnAppointment = apiBaseUrl + '/bookAppointment';
            apiDoctorAvailableTiming = apiBaseUrl + '/doctorAvailableTiming';
        } else {
            apiCheckHospitalAndDoctorDetails = '';
            apiBookAnAppointment = '';
            apiDoctorAvailableTiming = '';
        }

        Config = {
            sdkBaseUrl: sdkBaseUrl,
            apiBaseUrl: apiBaseUrl,
            apiCheckHospitalAndDoctorDetails: apiCheckHospitalAndDoctorDetails,
            apiBookAnAppointment: apiBookAnAppointment,
            apiDoctorAvailableTiming: apiDoctorAvailableTiming,
            hospitalKey: hospitalKey,
            doctorKey: doctorKey
        };
    }

    window.Medkumo = Medkumo;
})(this);

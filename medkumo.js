/*
 * Medkumo Javascript SDK
 *
 */
(function(window, undefined) {
    var Config = {};
    loadConfig(getUrlParameter("hospitalKey"), getUrlParameter("doctorKey"));
    checkHospitalKey();


    // functions
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
                    bookAnAppointmentEvents();
                } else {
                    renderMessage.error(data.message, '.medkumo-sdk-message');
                }
            },
            error: function(data) {
                console.log('error: ', data);
                renderMessage.error(data, '.medkumo-sdk-message');
            }
        });
    }

    function bookAnAppointmentEvents() {
        var currentDate = new Date().toISOString();
        var jsonDataCurrent = {
            "appointment_date": currentDate,
            "doctor_key": Config.doctorKey,
            "hospital_key": Config.hospitalKey
        };

        Medkumo.jQuery.ajax({
            type: 'POST',
            url: Config.apiDoctorAvailableTiming,
            data: JSON.stringify(jsonDataCurrent),
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
                if (data && data.code === "1") {
                    Medkumo.jQuery('.medkumo_datetime_picker').datetimepicker({
                        allowTimes: data.data.available_time,
                        onSelectDate: function(ct, $i) {
                            var dateSelect = new Date(ct.getTime()).toISOString();
                            console.log(dateSelect);
                            var jsonData = {
                                "appointment_date": dateSelect,
                                "doctor_key": Config.doctorKey,
                                "hospital_key": Config.hospitalKey
                            };
                            Medkumo.jQuery.ajax({
                                type: 'POST',
                                url: Config.apiDoctorAvailableTiming,
                                data: JSON.stringify(jsonData),
                                contentType: "application/x-www-form-urlencoded",
                                dataType: 'json',
                                success: function(data) {
                                    if (data && data.code === "1") {
                                        Medkumo.jQuery('.medkumo_datetime_picker').datetimepicker({
                                            allowTimes: data.data.available_time
                                        });
                                    } else {
                                        console.log('error: ', data);
                                        renderMessage.error("Can't get available timing of the doctor !", '.medkumo-sdk-message');
                                    }
                                },
                                error: function(data) {
                                    console.log('error: ', data);
                                    renderMessage.error("Can't get available timing of the doctor !", '.medkumo-sdk-message');
                                }
                            });
                        }
                    });
                } else {
                    console.log('error: ', data);
                    renderMessage.error("Can't get available timing of the doctor !", '.medkumo-sdk-message');
                }
            },
            error: function(data) {
                console.log('error: ', data);
                renderMessage.error("Can't get available timing of the doctor !", '.medkumo-sdk-message');
            }
        });


        Medkumo.jQuery(document).on("click", "#medkumo-sdk-form-row-book-button", function() {
            var patientName = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').val(),
                patientAge = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').val(),
                patientMobile = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
                patientMail = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
                appointmentDateAndTime = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="appointmentDateAndTime"]').datetimepicker('getValue'),
                appointmentDate = "",
                appointmentTime = "";

            if (validateBookAnAppointment() === false) {
                renderMessage.error('You must enter the valid data !', '.medkumo-sdk-message');
                return;
            } else {
                Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input').removeClass('input-error');
            }
            //14/12/2016
            appointmentDate = appointmentDateAndTime.getDate() + "/" + (appointmentDateAndTime.getMonth() + 1) + "/" + appointmentDateAndTime.getFullYear();
            appointmentTime = appointmentDateAndTime.getHours() + ":" + appointmentDateAndTime.getMinutes();

            var jsonData = {
                "hospital_key": Config.hospitalKey,
                "doctor_key": Config.doctorKey,
                "appointment_date": appointmentDate,
                "appointment_time": appointmentTime,
                "patient_id": "",
                "name": patientName,
                "age": patientAge,
                "gender": "1",
                "dob": "30/07/1984",
                "mobile_number": patientMobile,
                "email": patientMail
            };
            console.log('jsonData: ', jsonData);
            Medkumo.jQuery.ajax({
                type: 'POST',
                url: Config.apiBookAnAppointment,
                data: JSON.stringify(jsonData),
                contentType: "application/x-www-form-urlencoded",
                dataType: 'json',
                success: function(data) {
                    console.log('success: ', data);
                    if (data && data.code === "1") {
                        renderMessage.success(data.data, '.medkumo-sdk-message');
                    } else {
                        renderMessage.error(data.data, '.medkumo-sdk-message');
                    }

                },
                error: function(data) {
                    console.log('error: ', data);
                    renderMessage.error(data, '.medkumo-sdk-message');
                }
            });
        });

    }

    var renderMessage = {
        error: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            Medkumo.jQuery(element).removeClass('medkumo-sdk-success');
            Medkumo.jQuery(element).addClass('medkumo-sdk-error');
            Medkumo.jQuery(element).html(data);
        },
        success: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            Medkumo.jQuery(element).removeClass('medkumo-sdk-error');
            Medkumo.jQuery(element).addClass('medkumo-sdk-success');
            Medkumo.jQuery(element).html(data);
        }
    };
    // validation functions
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    function validateBookAnAppointment() {
        var result = true;
        var patientName = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').val(),
            patientAge = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').val(),
            patientMobile = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
            patientMail = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
            appointmentDateAndTime = Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="appointmentDateAndTime"]').val();
        if (patientName == null || patientName == "") {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').addClass("medkumo-input-error");
            result = false;
        } else {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').removeClass("medkumo-input-error");
        }

        if (patientAge != parseInt(patientAge, 10) || patientAge < 18 || patientAge > 100) {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').addClass("medkumo-input-error");
            result = false;
        } else {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').removeClass("medkumo-input-error");
        }

        if (!isValidEmailAddress(patientMail)) {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').addClass("medkumo-input-error");
            result = false;
        } else {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').removeClass("medkumo-input-error");
        }

        if (appointmentDateAndTime == null || appointmentDateAndTime == "") {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="appointmentDateAndTime"]').addClass("medkumo-input-error");
            result = false;
        } else {
            Medkumo.jQuery('#medkumo-sdk-book-an-appointment-form input[name="appointmentDateAndTime"]').removeClass("medkumo-input-error");
        }

        return result;
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

    function loadConfig(hospitalKey, doctorKey) {
        var sdkBaseUrl = '//scheduleplugin.loc:85/',
            apiBaseUrl = 'http://54.169.72.195/WebAppAPI/doctorApp.php/api/v1/doctor',
            apiCheckHospitalAndDoctorDetails = apiBaseUrl + '/checkHospitalAndDoctorDetails',
            apiBookAnAppointment = apiBaseUrl + '/bookAppointment',
            apiDoctorAvailableTiming = apiBaseUrl + '/doctorAvailableTiming';


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

})(this);

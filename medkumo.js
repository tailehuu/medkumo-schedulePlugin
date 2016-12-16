/*
 * Medkumo Javascript SDK
 *
 */
(function(window, undefined) {
    var Config = {},
        params = getUrlParameters(),
        date = new Date(),
        session = date.getDate() + "" + date.getMonth() + "" + date.getFullYear();
    if (params['session'] != session) {
        alert("Timeout expired !");
        return;
    }
    loadConfig(params["hospitalKey"], params["doctorKey"]);
    book();

    // functions
    function book() {
        checkHospitalAndDoctorDetails(renderBookAnAppointment);
    }

    function renderBookAnAppointment() {
        console.log('executing renderBookAnAppointment...');

        var strForm = '';
        strForm += '<div class="medkumo-sdk-message"></div>';
        strForm += '<div id="medkumo-sdk-book-an-appointment-form" class="medkumo-sdk-book-an-appointment">';
        strForm += '<div class="medkumo-sdk-form-row medkumo-sdk-item-center">';
        strForm += '<img src="' + Config.doctor.doctor_image + '" />';
        strForm += '<h4 class="">' + Config.doctor.doctor_name + '</h4>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Name</span>';
        strForm += '<input name="patientName" type="text" placeholder="Patient Name">';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Age</span>';
        strForm += '<input name="patientAge" class="medkumo-sdk-form-row-age-input" type="text" placeholder="Patient Age">';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">'
        strForm += '<label>';
        strForm += '<span>Mobile</span>';
        strForm += '<input name="patientMobile" type="text" placeholder="Mobile">';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Email</span>';
        strForm += '<input name="patientMail" class="medkumo-sdk-form-row-email-input" type="email" placeholder="Email">';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Date of birth</span>';
        strForm += '<input name="dob" type="text"  class="medkumo_datepicker" placeholder="Date of birth">';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Appointment Date & Time</span>';
        strForm += '<input id="appointmentDate" name="appointmentDate" type="text" placeholder="Appointment date">';
        strForm += '<select id="medkumo-sdk-timing" placeholder="Appointment time"></select>';
        strForm += '</label>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row">';
        strForm += '<label>';
        strForm += '<span>Gender</span>';
        strForm += '</label>';
        strForm += '<div style="display: inline-block;">Male<input type="radio" name="gender" value="1" checked="checked"></div>';
        strForm += '<div style="display: inline-block;">Female<input type="radio" name="gender" value="0"></div>';
        strForm += '</div>';
        strForm += '<div class="medkumo-sdk-form-row footer-group-button">';
        strForm += '<label>';
        strForm += '<span>&nbsp;</span>';
        strForm += '</label>';
        strForm += '<button id="medkumo-sdk-form-row-book-button">Book</button>';
        strForm += '</div>';
        strForm += '</div>';
        $("#medkumo-sdk-container .medkumo-sdk-body").html(strForm);
        // events
        bookAnAppointmentEvents();
    }

    function bookAnAppointmentEvents() {
        var currentDate = new Date(),
            date, dateSelect, jsonData;
        $(".medkumo_datepicker").datepicker({
            dateFormat: 'd/m/yy'
        });
        getAvailableTiming(currentDate.toISOString(), renderOptionTiming);
        $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker({
            dateFormat: 'd/m/yy',
            minDate: currentDate,
            onSelect: function(data) {
                date = $(this).datepicker('getDate');
                dateSelect = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                getAvailableTiming(dateSelect, renderOptionTiming);
            }
        }).datepicker('setDate', currentDate);

        // Booking submit event
        $(document).on("click", "#medkumo-sdk-form-row-book-button", function() {
            var patientName = $('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').val(),
                patientAge = $('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').val(),
                patientMobile = $('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
                patientMail = $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
                dobValue = $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').datepicker('getDate'),
                dob = "",
                gender = $('#medkumo-sdk-book-an-appointment-form input[name="gender"]').val(),
                appointmentDateValue = $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker('getDate'),
                appointmentDate = "",
                appointmentTime = $('#medkumo-sdk-book-an-appointment-form #medkumo-sdk-timing').val();

            if (validateBookAnAppointment() === false) {
                renderMessage.error('You must enter the valid data !', '.medkumo-sdk-message');
                return;
            } else {
                $('#medkumo-sdk-book-an-appointment-form input').removeClass('input-error');
            }
            //14/12/2016
            if (appointmentDateValue != null) {
                appointmentDate = appointmentDateValue.getDate() + "/" + (appointmentDateValue.getMonth() + 1) + "/" + appointmentDateValue.getFullYear();
            }
            if (dobValue != null) {
                dob = dobValue.getDate() + "/" + (dobValue.getMonth() + 1) + "/" + dobValue.getFullYear();
            }

            jsonData = {
                "hospital_key": Config.hospitalKey,
                "doctor_key": Config.doctorKey,
                "appointment_date": appointmentDate,
                "appointment_time": appointmentTime,
                "patient_id": "",
                "name": patientName,
                "age": patientAge,
                "gender": gender,
                "dob": dob,
                "mobile_number": patientMobile,
                "email": patientMail
            };
            console.log('jsonData: ', jsonData);
            $.ajax({
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

    function checkHospitalAndDoctorDetails(callback) {
        console.log('executing checkHospitalAndDoctorDetails...');

        var jsonData = {
            "hospital_key": Config.hospitalKey,
            "doctor_key": Config.doctorKey
        };
        $.ajax({
            type: 'POST',
            url: Config.apiCheckHospitalAndDoctorDetails,
            data: JSON.stringify(jsonData),
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
                console.log('success: ', data);
                if (data.code === '1') {
                    Config.doctor = data.data;
                    callback();
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

    function getAvailableTiming(dateSelect, callback) {
        var jsonData = {
            "appointment_date": dateSelect,
            "doctor_key": Config.doctorKey,
            "hospital_key": Config.hospitalKey
        };
        $.ajax({
            type: 'POST',
            url: Config.apiDoctorAvailableTiming,
            data: JSON.stringify(jsonData),
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function(data) {
                if (data && data.code === "1") {
                    callback(data.data.available_time);
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

    function renderOptionTiming(available_times) {
        var htmlOptions = '';
        available_times.map(function(ele, index) {
            htmlOptions += '<option value="' + ele + '">' + ele + '</option>';
        });
        $('#medkumo-sdk-timing').html(htmlOptions);
    }

    var renderMessage = {
        error: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            $(element).removeClass('medkumo-sdk-success');
            $(element).addClass('medkumo-sdk-error');
            $(element).html(data);
        },
        success: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            $(element).removeClass('medkumo-sdk-error');
            $(element).addClass('medkumo-sdk-success');
            $(element).html(data);
        }
    };
    // validation functions
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    function validateBookAnAppointment() {
        var result = true,
            patientName = $('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').val(),
            patientAge = $('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').val(),
            patientMobile = $('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
            patientMail = $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
            dobValue = $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').datepicker('getDate'),
            gender = $('#medkumo-sdk-book-an-appointment-form input[name="gender"]').val(),
            appointmentDateValue = $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker('getDate'),
            appointmentTime = $('#medkumo-sdk-book-an-appointment-form #medkumo-sdk-timing').val();
        if (patientName == null || patientName == "") {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').removeClass("medkumo-input-error");
        }

        if (patientAge != parseInt(patientAge, 10) || patientAge < 18 || patientAge > 100) {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientAge"]').removeClass("medkumo-input-error");
        }

        if (!isValidEmailAddress(patientMail)) {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').removeClass("medkumo-input-error");
        }

        if (dobValue == null || dobValue == "") {
            $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').removeClass("medkumo-input-error");
        }

        if (appointmentTime == null || appointmentTime == "") {
            $('#medkumo-sdk-book-an-appointment-form #medkumo-sdk-timing').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form #medkumo-sdk-timing').removeClass("medkumo-input-error");
        }

        if (appointmentDateValue == null || appointmentDateValue == "") {
            $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').addClass("medkumo-input-error");
            result = false;
        } else {
            $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').removeClass("medkumo-input-error");
        }

        return result;
    }

    function concatString(arrayKeys) {
        var result = '';
        if (arrayKeys && arrayKeys.length > 0) {
            arrayKeys.map(function(item, index) {
                result += ' ' + Config.doctor[item];
            });
        }
        return result;
    }

    function getUrlParameters() {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i, resObject = {};

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            resObject[sParameterName[0]] = sParameterName[1] === undefined ? true : sParameterName[1];
        }
        return resObject;
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
            doctorKey: doctorKey,
            doctor: {}
        };
    }

})(this);

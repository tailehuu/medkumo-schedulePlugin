/*
 * Medkumo Javascript SDK functions
 *
 */
(function(window, undefined) {
    var Config = {};
    init();
    book();

    // functions
    function init() {
        var params = getUrlParameters(),
            date = new Date(),
            session = date.getDate() + "" + date.getMonth() + "" + date.getFullYear(),
            hospitalKey = params["hospitalKey"],
            doctorKey = params["doctorKey"];
        if (params['session'] != session) {
            alert("Timeout expired !");
            return;
        }
        loadConfig(hospitalKey, doctorKey);
    }

    function book() {
        checkHospitalAndDoctorDetails(renderBookAnAppointment);
    }

    function renderBookAnAppointment() {
        console.log('executing renderBookAnAppointment...');

        var strForm = '';
        strForm += '<div class="row">';
        strForm += '  <div class="col-xs-12 col-sm-12 col-md-12 bg-primary">';
        strForm += '    <div class="doctor-info">';
        strForm += '      <div class="media">';
        strForm += '        <div class="media-left media-middle">';
        strForm += '          <a href="#" class="doctor-avatar-container">';
        strForm += '            <img src="' + Config.doctor.doctor_image + '" class="doctor-avatar" alt="Cinque Terre" width="50">';
        strForm += '          </a>';
        strForm += '        </div>';
        strForm += '        <div class="media-body">';
        strForm += '          <p class="media-heading"><span class="heading_doctor_name">' + Config.doctor.doctor_name + ',</span> <span>' + Config.doctor.doctor_qualifications + '</span></p>';
        strForm += '          <p>' + Config.doctor.hospital_name + '</p>';
        strForm += '          <p>' + getDoctorAddress() + '</p>';
        strForm += '        </div>';
        strForm += '      </div>';
        strForm += '    </div>';
        strForm += '  </div>';
        strForm += '</div>';
        strForm += '<div class="row padding-top-15">';
        strForm += '  <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '    <div id="medkumo-sdk-book-an-appointment-form" class="form-container">';
        strForm += '      <div class="form-group has-feedback">';
        strForm += '        <label class="control-label">Name<span class="text-danger"> *</span></label>';
        strForm += '        <label class="control-label validate"></label>';
        strForm += '        <input name="patientName" type="text" class="form-control" id="name" placeholder="First name Last name">';
        strForm += '        <span class="glyphicon glyphicon-user form-control-feedback" aria-hidden="true"></span>';
        strForm += '      </div>';
        strForm += '      <div class="form-group  has-feedback">';
        strForm += '        <label class="control-label">Email</label>';
        strForm += '        <label class="control-label validate"></label>';
        strForm += '        <input name="patientMail" type="email" class="form-control" id="mail" placeholder="youremail@domain.com">';
        strForm += '        <span class="glyphicon glyphicon-envelope form-control-feedback" aria-hidden="true"></span>';
        strForm += '      </div>';
        strForm += '      <div class="form-group has-feedback">';
        strForm += '        <label class="control-label" for="mobile">Mobile Number <span class="text-danger"> *</span></label>';
        strForm += '        <label class="control-label validate"></label>';
        strForm += '        <div class="input-group">';
        strForm += '          <span class="input-group-addon">+91</span>';
        strForm += '          <input name="patientMobile" type="text" class="form-control" id="mobile" placeholder="1234567890">';
        strForm += '          <span class="input-group-icon glyphicon glyphicon-earphone form-control-feedback" aria-hidden="true"></span>';
        strForm += '        </div>';
        strForm += '      </div>';
        strForm += '      <div class="form-group has-feedback">';
        strForm += '        <label class="control-label" for="birthDay">Date of Birth<span class="text-danger"> *</span></label>';
        strForm += '        <label class="control-label validate"></label>';
        strForm += '        <input name="dob" type="text" class="form-control medkumo_datepicker" id="birthDay" placeholder="dd/mm/YYYY">';
        strForm += '        <span class="glyphicon glyphicon-calendar form-control-feedback" aria-hidden="true"></span>';
        strForm += '      </div>';
        strForm += '      <div class="form-group">';
        strForm += '      <div class="row">';
        strForm += '        <div class="col-xs-6">';
        strForm += '          <label class="control-label" for="appointmentDate">Appointment Date<span class="text-danger"> *</span></label>';
        strForm += '          <input name="appointmentDate" type="text" class="form-control" id="appointmentDate" placeholder="dd/mm/YYYY">';
        strForm += '        </div>';
        strForm += '        <div class="col-xs-6">';
        strForm += '          <label class="control-label" for="appointmentTime">Appointment Time<span class="text-danger"> *</span></label>';
        strForm += '          <select id="appointmentTime" class="form-control"></select>';
        strForm += '        </div>';
        strForm += '      </div>';
        strForm += '    </div>';
        strForm += '    <div class="text-center ">';
        strForm += '      <div class="radio-inline ">';
        strForm += '        <input type="radio" name="gender" id="radioMale" value="1" checked>';
        strForm += '        <label for="radioMale">Male</label>';
        strForm += '      </div>';
        strForm += '      <div class="radio-inline ">';
        strForm += '        <input type="radio" name="gender" id="radioFemale" value="0">';
        strForm += '        <label for="radioFemale">Female</label>';
        strForm += '      </div>';
        strForm += '    </div>';
        strForm += '    <div class="padding-top-10"><button id="medkumo-sdk-form-row-book-button" class="btn btn-warning center-block ">Book Appointment</button></div>';
        strForm += '  </div>';
        strForm += '</div>';
        $(".medkumo-sdk-body").html(strForm);

        // events
        bookAnAppointmentEvents(renderConfirmationPage);
    }

    function handleInputChange() {
        var patientName = '#medkumo-sdk-book-an-appointment-form input[name="patientName"]',
            patientMobile = '#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]',
            patientMail = '#medkumo-sdk-book-an-appointment-form input[name="patientMail"]',
            dobValue = '#medkumo-sdk-book-an-appointment-form input[name="dob"]',
            appointmentDateValue = '#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]',
            appointmentTime = '#medkumo-sdk-book-an-appointment-form #appointmentTime';

        $(document).on('change',
            '#medkumo-sdk-book-an-appointment-form input[name="patientName"], #medkumo-sdk-book-an-appointment-form input[name="patientMobile"],#medkumo-sdk-book-an-appointment-form input[name="patientMail"], #medkumo-sdk-book-an-appointment-form input[name="dob"], #medkumo-sdk-book-an-appointment-form input[name="appointmentDate"], #medkumo-sdk-book-an-appointment-form input[name="appointmentTime"]',
            function() {
                var objValid = valid(),
                    form_group = $(this).parents('.form-group');
                if (objValid[$(this).attr('name')]) {
                    form_group.addClass('has-error');
                    form_group.removeClass('has-success');
                    result = false;
                } else {
                    form_group.addClass('has-success');
                    form_group.removeClass('has-error');
                }
                form_group.find('.validate').html(objValid[$(this).attr('name')]);
            });
    }

    function bookAnAppointmentEvents(callback) {
        handleInputChange();
        $('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').keypress(function(event) {
            return isNumber(event);
        });

        // get avilable timing
        var currentDate = new Date(),
            date,
            dateSelect,
            jsonData;
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
                patientMobile = $('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
                patientMail = $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
                dobValue = $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').datepicker('getDate'),
                dob = "",
                gender = $('#medkumo-sdk-book-an-appointment-form input[name="gender"]').val(),
                appointmentDateValue = $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker('getDate'),
                appointmentDate = "",
                appointmentTime = $('#medkumo-sdk-book-an-appointment-form #appointmentTime').val();

            if (validateBookAnAppointment() === false) {
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
                "age": 0,
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
                        // callback
                        callback(data);
                    } else {
                        alert(data.message);
                    }

                },
                error: function(data) {
                    console.log('error: ', data);
                    alert(data, '.medkumo-sdk-message');
                }
            });
        });
    }

    function renderConfirmationPage(data) {
        var strForm = '';
        strForm += '<div class="row">';
        strForm += '  <div class="col-xs-12 col-sm-12 col-md-12 bg-primary">';
        strForm += '    <div class="doctor-info">';
        strForm += '      <div class="media">';
        strForm += '        <div class="media-left media-middle">';
        strForm += '          <a href="#" class="doctor-avatar-container">';
        strForm += '            <img src="' + Config.doctor.doctor_image + '" class="doctor-avatar" alt="Cinque Terre" width="50">';
        strForm += '          </a>';
        strForm += '        </div>';
        strForm += '        <div class="media-body">';
        strForm += '          <p class="media-heading"><span class="heading_doctor_name">' + Config.doctor.doctor_name + ',</span> <span>' + Config.doctor.doctor_qualifications + '</span></p>';
        strForm += '          <p>' + Config.doctor.hospital_name + '</p>';
        strForm += '          <p>' + getDoctorAddress() + '</p>';
        strForm += '        </div>';
        strForm += '      </div>';
        strForm += '    </div>';
        strForm += '  </div>';
        strForm += '</div>';
        strForm += '<div id="confirmation-body" class="row padding-top-15">';
        strForm += '  <div id="confirmation-msg">' + data.data + '</div>';
        strForm += '</div>';
        $(".medkumo-sdk-body").html(strForm);
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
                    renderMessage.error(data.message);
                }
            },
            error: function(data) {
                console.log('error: ', data);
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
                    alert("Can't get available timing of the doctor !");
                }
            },
            error: function(data) {
                console.log('error: ', data);
                console.log("Can't get available timing of the doctor !");
            }
        });
    }

    function renderOptionTiming(available_times) {
        var htmlOptions = '';
        available_times.map(function(ele, index) {
            htmlOptions += '<option value="' + ele + '">' + ele + '</option>';
        });
        $('#appointmentTime').html(htmlOptions);
    }

    var renderMessage = {
        error: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            $(element).removeClass('alert alert-success');
            $(element).addClass('alert alert-danger');
            $(element).html(data);
        },
        success: function(data, element) {
            if (typeof(element) == 'undefined') {
                element = '.medkumo-sdk-body';
            }
            $(element).removeClass('alert alert-danger');
            $(element).addClass('alert alert-success');
            $(element).html(data);
        }
    };
    // validation functions
    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    function valid() {
        var result = {};
        result.isValid = true;
        var patientName = $('#medkumo-sdk-book-an-appointment-form input[name="patientName"]').val(),
            patientMobile = $('#medkumo-sdk-book-an-appointment-form input[name="patientMobile"]').val(),
            patientMail = $('#medkumo-sdk-book-an-appointment-form input[name="patientMail"]').val(),
            dobValue = $('#medkumo-sdk-book-an-appointment-form input[name="dob"]').datepicker('getDate'),
            gender = $('#medkumo-sdk-book-an-appointment-form input[name="gender"]').val(),
            appointmentDateValue = $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker('getDate'),
            appointmentTime = $('#medkumo-sdk-book-an-appointment-form #appointmentTime').val();

        result['patientName'] = '';
        if (patientName == null || patientName == "") {
            result['patientName'] = 'This field is required';
            result.isValid = false;
        }

        result['patientMobile'] = '';
        if (patientMobile == null || patientMobile == "" || (patientMobile != null && patientMobile.length != 10)) {
            result['patientMobile'] = 'Mobile number must be exactly 10 digits';
            result.isValid = false;
        }

        result['patientMail'] = '';
        if (patientMail != "" && !isValidEmailAddress(patientMail)) {
            result['patientMail'] = 'Invalid email address';
            result.isValid = false;
        }

        result['dob'] = '';
        if (dobValue == null || dobValue == "") {
            result['dob'] = 'This field is required';
            result.isValid = false;
        }

        result['appointmentTime'] = '';
        if (appointmentTime == null || appointmentTime == "") {
            result['appointmentTime'] = 'This field is required';
            result.isValid = false;
        }

        result['appointmentDate'] = '';
        if (appointmentDateValue == null || appointmentDateValue == "") {
            result['appointmentDate'] = 'This field is required';
            result.isValid = false;
        }
        return result;
    }

    function validateBookAnAppointment() {
        var objValids = valid(),
            form_group;
        Object.keys(objValids).map(function(key, index) {
            form_group = $('#medkumo-sdk-book-an-appointment-form input[name="' + key + '"]').parents('.form-group');
            if (objValids[key]) {
                form_group.addClass('has-error');
                form_group.removeClass('has-success');
            } else {
                form_group.removeClass('has-error');
            }
            form_group.find('.validate').html(objValids[key]);
        });
        return objValids.isValid;
    }

    function getDoctorAddress() {
        var addresses = [];
        if (Config.doctor.hospital_address != "") {
            addresses.push(Config.doctor.hospital_address);
        }
        if (Config.doctor.hospital_area != "") {
            addresses.push(Config.doctor.hospital_area);
        }
        if (Config.doctor.hospital_city != "") {
            addresses.push(Config.doctor.hospital_city);
        }
        return addresses.join(", ");
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

    function isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    function loadConfig(hospitalKey, doctorKey) {
        var apiBaseUrl = 'http://54.169.72.195/WebAppAPI/doctorApp.php/api/v1/doctor',
            apiCheckHospitalAndDoctorDetails = apiBaseUrl + '/checkHospitalAndDoctorDetails',
            apiBookAnAppointment = apiBaseUrl + '/bookAppointment',
            apiDoctorAvailableTiming = apiBaseUrl + '/doctorAvailableTiming';

        Config = {
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

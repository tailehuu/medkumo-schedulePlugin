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
        initSpinner();
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
        strForm += '      <div class="row">';
        strForm += '        <div class="form-group col-xs-6">';
        strForm += '          <label class="control-label" for="appointmentDate">Appointment Date<span class="text-danger"> *</span></label>';
        strForm += '          <input name="appointmentDate" type="text" class="form-control" id="appointmentDate" placeholder="dd/mm/YYYY">';
        strForm += '        </div>';
        strForm += '        <div class="form-group col-xs-6">';
        strForm += '          <label class="control-label" for="appointmentTime">Appointment Time<span class="text-danger"> *</span></label>';
        strForm += '          <select id="appointmentTime" class="form-control"></select>';
        strForm += '        </div>';
        strForm += '      </div>';
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
            jsonData,
            age = 0;
        $(".medkumo_datepicker").datepicker({
            dateFormat: 'd/m/yy'
        });
        getAvailableTiming(currentDate.toISOString(), renderOptionTiming);

        $('#medkumo-sdk-book-an-appointment-form input[name="appointmentDate"]').datepicker({
            dateFormat: 'd/m/yy',
            minDate: currentDate,
            onSelect: function(data) {
                $(this).trigger('change');
                date = $(this).datepicker('getDate');
                dateSelect = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                getAvailableTiming(dateSelect, renderOptionTiming);
            }
        }).datepicker('setDate', currentDate).attr('readonly', 'readonly');

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

            age = currentDate.getFullYear() - dobValue.getFullYear();
            jsonData = {
                "hospital_key": Config.hospitalKey,
                "doctor_key": Config.doctorKey,
                "appointment_date": appointmentDate,
                "appointment_time": appointmentTime,
                "patient_id": "",
                "name": patientName,
                "age": age,
                "gender": gender,
                "dob": dob,
                "mobile_number": patientMobile,
                "email": patientMail
            };
            console.log('jsonData: ', jsonData);

            spinner.show();
            $.ajax({
                type: 'POST',
                url: Config.apiBookAnAppointment,
                data: JSON.stringify(jsonData),
                contentType: "application/x-www-form-urlencoded",
                dataType: 'json',
                success: function(data) {
                    console.log('success: ', data);
                    spinner.hide();
                    if (data && data.code === "1") {
                        // callback
                        var fullData = addSomeMissingData(data.appointment_details[0], jsonData);
                        callback(fullData);
                    } else {
                        alert(data.message);
                    }
                },
                error: function(data) {
                    console.log('error: ', data);
                    spinner.hide();
                    alert(data, '.medkumo-sdk-message');
                }
            });
        });
    }

    function addSomeMissingData(data, jsonData) {
        if (!data.email) {
            data.email = jsonData.email;
        }
        if (!data.mobile_number) {
            data.mobile_number = jsonData.mobile_number;
        }
        if (!data.dob) {
            data.dob = jsonData.dob;
        }
        return data;
    }

    function renderConfirmationPage(data) {
        var appointment_date = $.format.date(data.appointment_date, 'dd MMM yyyy'),
            appointment_time = data.appointment_time ? data.appointment_time.substring(0, 5) : '',
            strForm = '';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12 bg-success">';
        strForm += '        <div class="doctor-info">';
        strForm += '            <div class="media">';
        strForm += '                <div class="media-left media-middle">';
        strForm += '                    <a href="#" class="appoitment-avatar-success">';
        strForm += '                        <i class="medkumocheck-okpart2 font-size-75 "></i>';
        strForm += '                    </a>';
        strForm += '                </div>';
        strForm += '                <div class="media-body">';
        strForm += '                    <h3 class="media-heading text-info">Appointment Confirm!</h3>';
        strForm += '                    <h3 class="media-heading text-info">' + appointment_date + ' | ' + appointment_time + ' Hrs</h3>';
        strForm += '                </div>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="modal-header appointment-info-summary">';
        strForm += '            <h3 class="modal-title">';
        strForm += '            <span class="text-warning">Appointment Summary </span>';
        strForm += '          </h3>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row padding-top-15">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Name </p>';
        strForm += '                <p> ' + data.name + ' </p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Email </p>';
        strForm += '                <p> ' + data.email + ' </p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Mobile </p>';
        strForm += '                <p> +91' + data.mobile_number + '</p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Date of Birth </p>';
        strForm += '                <p> ' + data.dob + ' </p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Appointment Date </p>';
        strForm += '                <p> ' + appointment_date + ' </p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '        <div class="col-sm-4">';
        strForm += '            <div class="form-group">';
        strForm += '                <p class="text-warning"> Appointment Time </p>';
        strForm += '                <p> ' + appointment_time + ' Hrs </p>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="modal-header appointment-info-summary">';
        strForm += '            <h3 class="modal-title">';
        strForm += '            <span class="text-warning">Doctor Summary </span>';
        strForm += '          </h3>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="doctor-info">';
        strForm += '            <div class="media">';
        strForm += '                <div class="media-left media-middle">';
        strForm += '                    <a href="#" class="doctor-avatar-summary">';
        strForm += '                        <i class="medkumoong-nghepart2 font-size-75">';
        strForm += '                          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span strForm +=class="path10"></span>';
        strForm += '                        </i>';
        strForm += '                    </a>';
        strForm += '                </div>';
        strForm += '                <div class="media-body">';
        strForm += '                    <h4 class="media-heading">' + data.doctor_name + '</h4>';
        strForm += '                    <p>' + data.specialization + '</p>';
        strForm += '                </div>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row ">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="modal-header appointment-info-summary">';
        strForm += '            <h3 class="modal-title">';
        strForm += '            <span class="text-warning">Venu </span>';
        strForm += '          </h3>';
        strForm += '        </div>';
        strForm += '    </div>';
        strForm += '</div>';
        strForm += '<div class="row">';
        strForm += '    <div class="col-xs-12 col-sm-12 col-md-12">';
        strForm += '        <div class="doctor-info">';
        strForm += '            <div class="media">';
        strForm += '                <div class="media-left media-middle">';
        strForm += '                    <a href="#" class="doctor-avatar-summary">';
        strForm += '                      <i class="medkumobenh-vienpart2 font-size-75">';
        strForm += '                        <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span strForm +=class="path25"></span><span class="path26"></span><span class="path27"></span><span class="path28"></span>';
        strForm += '                      </i>';
        strForm += '                    </a>';
        strForm += '                </div>';
        strForm += '                <div class="media-body">';
        strForm += '                    <h4 class="media-heading">' + data.hospital_name + '</h4>';
        strForm += '                    <p>' + getDoctorAddress() + '</p>';
        strForm += '                </div>';
        strForm += '            </div>';
        strForm += '        </div>';
        strForm += '    </div>';
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

    function initSpinner() {
        var opts = {
                lines: 13, // The number of lines to draw
                length: 28, // The length of each line
                width: 14, // The line thickness
                radius: 42, // The radius of the inner circle
                scale: 1, // Scales overall size of the spinner
                corners: 1, // Corner roundness (0..1)
                color: '#000', // #rgb or #rrggbb or array of colors
                opacity: 0.25, // Opacity of the lines
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                speed: 1.5, // Rounds per second
                trail: 60, // Afterglow percentage
                fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                className: 'spinner', // The CSS class to assign to the spinner
                top: '50%', // Top position relative to parent
                left: '50%', // Left position relative to parent
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                position: 'absolute', // Element positioning
            },
            target = document.getElementById('spinner_image'),
            spinner = new Spinner(opts).spin(target);
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

    var spinner = {
        show: function() {
          $('#spinner').modal('show');
        },
        hide: function() {
          $('#spinner').modal('hide');
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
            result['patientName'] = Config.message.required;
            result.isValid = false;
        }

        result['patientMobile'] = '';
        if (patientMobile == null || patientMobile == "" || (patientMobile != null && patientMobile.length != 10)) {
            result['patientMobile'] = Config.message.invalidMobile;
            result.isValid = false;
        }

        result['patientMail'] = '';
        if (patientMail != "" && !isValidEmailAddress(patientMail)) {
            result['patientMail'] = Config.message.invalidEmail;
            result.isValid = false;
        }

        result['dob'] = '';
        if (dobValue == null || dobValue == "") {
            result['dob'] = Config.message.required;
            result.isValid = false;
        } else {
            var cd = new Date(),
                ct = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate()).getTime();
            if (dobValue.getTime() > ct) {
                result['dob'] = Config.message.dob;
                result.isValid = false;
            }
        }

        result['appointmentTime'] = '';
        if (appointmentTime == null || appointmentTime == "") {
            result['appointmentTime'] = Config.message.required;
            result.isValid = false;
        }

        result['appointmentDate'] = '';
        if (appointmentDateValue == null || appointmentDateValue == "") {
            result['appointmentDate'] = Config.message.required;
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
            doctor: {},
            message: {
                required: 'This field is required',
                dob: 'The date of birth Invalid',
                invalidEmail: 'Invalid email address',
                invalidMobile: 'Mobile number must be exactly 10 digits'
            }
        };
    }

})(this);

_onSubmit_NameForm = () => {
    var firstName = $("#firstName").val();
    var lastName  = $("#lastName").val();

    $.ajax({
        url: $('#nameForm').attr('action'),
        type: $('#nameForm').attr('method'),
        data: {firstName: firstName, lastName: lastName},
        success: _onSuccess_NameForm
    });

    event.preventDefault();
}

_onSuccess_NameForm = (res) => {
    var firstName = $("#firstName").val();
    var lastName  = $("#lastName").val();

    if (res.result == 0) {
        $(".user-name").text(firstName + " " + lastName);
        $("#nameFormModal").modal('toggle');
        $("#firstName").val("");
        $("#lastName").val("");
    }
}

_onSubmit_TagForm = () => {
    var tag = $("#tag").val();

    $.ajax({
        url: $('#tagForm').attr('action'),
        type: $('#tagForm').attr('method'),
        data: {tag: tag},
        success: _onSuccess_TagForm
    });

    event.preventDefault();
}

_onSuccess_TagForm = (res) => {
    var tag = $("#tag").val();

    if (res.result == 0) {
        $(".user-tag").text(tag);
        $("#tagFormModal").modal('toggle');
        $("#tag").val("");
    }
}

_onSubmit_EmailForm = () => {
    var email = $("#email").val();

    $.ajax({
        url: $('#emailForm').attr('action'),
        type: $('#emailForm').attr('method'),
        data: {email: email},
        success: _onSuccess_EmailForm
    });

    event.preventDefault();
}

_onSuccess_EmailForm = (res) => {
    var email = $("#email").val(); 

    if (res.result == 0) {
        $(".user-email").text(email);
        $("#emailFormModal").modal('toggle');
        $("#email").val("");
    }
}

_onSuccess_GetUserInfo = (res) => {
    
    if (res.result == 0) {
        $(".user-name").text(res.user.fullname);
        $(".user-email").text(res.user.email);
        $(".user-tag").text(res.user.tag);
        $('#select_language').val(res.user.language);
        $('#select_dateformat').val(res.user.date_format);
        $('#select_timezone').val(res.user.timezone);
    }
}

_onChange_SelectLanguage = () => {
    $.ajax({
        url: '/dashboard/settings/account/changeLanguage',
        data: {language: $('#select_language').val()},
        type: 'POST'
    });
}

_onChange_SelectDateFormat = () => {
    $.ajax({
        url: '/dashboard/settings/account/changeDateFormat',
        data: {date_format: $('#select_dateformat').val()},
        type: 'POST'
    });
}

_onChange_SelectTimezone = () => {
    $.ajax({
        url: '/dashboard/settings/account/changeTimezone',
        data: {timezone: $("#select_timezone").val()},
        type: 'POST'
    });
}

_onAccountTab_Load = () => {
    
    // console.log(moment.tz('America/New_York').utcOffset());
    // console.log(moment.tz.guess());
    // console.log(moment.tz("America/Los_Angeles").format());
    // console.log(moment.tz.names());
    // var localTime  = moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss')).toDate();
    // console.log(moment(localTime).format('YYYY-MM-DD HH:mm:ss'));

    load_Timezone_Data();

    $.ajax({
        url: '/dashboard/settings/account/getUserInfo',
        type: 'POST',
        success: _onSuccess_GetUserInfo
    });

    $("#btn_deactivate").click(() => {
        location.href = "/dashboard/settings/account/deactivate";
    });

    $("#select_language").on('change', _onChange_SelectLanguage);
    $("#select_dateformat").on('change', _onChange_SelectDateFormat);
    $("#select_timezone").on('change', _onChange_SelectTimezone);
}

load_Timezone_Data = () => {
    var select_timezone = $('#select_timezone');
    var timezone_names = moment.tz.names(); 
    for (var i = 0; i < timezone_names.length; i++) {
        var opt = document.createElement('option');
        opt.value = timezone_names[i];
        opt.innerHTML = timezone_names[i];
        select_timezone.append(opt);
    }
}





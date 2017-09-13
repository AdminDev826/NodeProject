
$('document').ready(function() {

    $('#reset_password_form').submit(function() {
        var password        = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        if (password != confirmPassword) {
            $('#password_not_matched').css('display', '');
            event.preventDefault();
        } else if (email_use_flag) {
            $('#email_already_in_use_alert').css('display', '');
            event.preventDefault();
        }
    });

});


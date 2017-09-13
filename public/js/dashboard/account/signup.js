
$('document').ready(function() {

    var email_use_flag = false; //false : valid, true: invalid

    $('#email_already_in_use_alert').css('display', 'none');
    $('#password_not_matched').css('display', 'none');
    $('#timezone').val(moment.tz.guess());

    var currentURL = location.href;

    $('#register_form').submit(function() {
        var password        = $('#inputPassword').val();
        var confirmPassword = $('#inputPasswordCheck').val();

        if (password != confirmPassword) {
            $('#password_not_matched').css('display', '');
            event.preventDefault();
        } else if (email_use_flag) {
            $('#email_already_in_use_alert').css('display', '');
            event.preventDefault();
        }
        
    });

    $('#inputEmail').keyup(function() {
        $.post(currentURL + '/checkValidEmail', {email: $('#inputEmail').val()}).done(function(data) {
            console.log('checkValidEmail: ', data);
            if (data == 'invalid') {
                $('#email_already_in_use_alert').css('display', '');
                email_use_flag = true;
            } else if (data == 'valid') {
                $('#email_already_in_use_alert').css('display', 'none');
                email_use_flag = false;
            }
        });
    });
});


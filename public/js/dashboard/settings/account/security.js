_onSubmit_ChangePasswordForm = () => {
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    
    if (newPassword != confirmPassword) {
        $('#password_not_matched').css('display', 'block');
    } else {
        $('#password_not_matched').css('display', 'none');
        $.ajax({
            url: $('#changePasswordForm').attr('action'),
            type: $('#changePasswordForm').attr('method'),
            data: {oldPassword: oldPassword, newPassword: newPassword},
            success: _onSuccess_ChangePasswordForm
        });
    }

    event.preventDefault();
}

_onSuccess_ChangePasswordForm = (res) => {

    if (res.result != 0) {
        $('.security_message').text("Your current password is incorrect");
        $('#password_not_matched').css('display', 'block');
    } else {
        $(".close").trigger("click");
        $("#successMessage").trigger("click");
        $("#oldPassword").val("");
        $("#newPassword").val("");
        $("#confirmPassword").val("");
        $('.nav-tabs a[href="#' + "tab_security" + '"]').tab('show');
    }
}

_onSecurityTab_Load = () => {
    
}
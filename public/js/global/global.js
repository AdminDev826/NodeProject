window.onload = function() {
    initGlobalComponent();
    initGlobalEventHandler();
}

function initGlobalComponent() {
    initFormValidator();
}

function initGlobalEventHandler() {
    $(".frm-contact").unbind("submit").bind("submit", function(e){
        e.preventDefault();
        sendMessage({
            name    : $("#contact_form #name").val(),
            email   : $("#contact_form #email").val(),
            phone   : $("#contact_form #phone").val(),
            message : $("#contact_form #message").val()
        });
        $("#contactFormModal").modal("toggle");
    });
}

function sendMessage(param) {
    $("#spinnerModal").modal("toggle");
    var subject = "";
    if (location.pathname == "/contact") {
        subject = "Contact Us";
    } else  if (location.pathname == "/partners/mssp") {
        subject = "Apply - MSSP";
    } else  if (location.pathname == "/partners/oem") {
        subject = "Apply - OEM";
    } else  if (location.pathname == "/partners/resellers") {
        subject = "Apply - Resellers";
    } else  if (location.pathname == "/partners/technology") {
        subject = "Apply - Technology";
    } else {
        subject = "Schedule Demo";
    }

    param.subject = subject;

    $.ajax({
        url: "/support",
        type: "POST",
        data: param,
        success: (res) => {
            $("#spinnerModal").modal("toggle");
            if (res.success) {
                showMessage("Thank you for contacting the Mycroft Team. You should receive an email response shortly.", "success");
            } else {
                showMessage("Sending message is failed.", "danger");
            }
            
        }
    });
}

function showMessage(message, style) {
    if (message != "") {
        $("#messageTrigger").data("message", message);
    }
    if (style == "success") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-success");
    } else if (style == "warning") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-warning");
    } else if (style == "danger") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-danger");
    }
    $("#messageTrigger").click();
}

function initFormValidator() {
    $("#contact_form").formValidation({
        framework: "bootstrap4",
        button: {
            selector: ".btn-send",
            disabled: 'disabled'
        },
        icon: null,
        err: {
            clazz: 'text-help'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Name is required'
                    },
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Email is required'
                    },
                    emailAddress: {
                        message: 'Email address is not valid'
                    }
                }
            },
            message: {
                validators: {
                    notEmpty: {
                        message: "Message is required"
                    }
                }
            }
        },
        row: {
            invalid: 'has-warning'
        }
    });
}
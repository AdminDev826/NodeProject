$('document').ready(function() {
    init_Month_Select();
    init_Year_Select();
    init_validator();
    load_Country_List();
    load_Billing_Info();
});

init_Month_Select = () => {
    var select_Month = $("#plan_billing_month");
    for (var i = 1; i <= 12; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select_Month.append(opt);
    }
}

init_Year_Select = () => {
    var select_Year = $("#plan_billing_year");
    for (var i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select_Year.append(opt);
    }
}

init_validator = () => { 
    $('#plan_billing_detail_form').formValidation({
        framework: "bootstrap4",
        autoFocus: true,
        err: {
            clazz: 'text-help'
        },

        fields: {
            cardNumber: {
                validators: {
                    creditCard: {
                        message: 'The card number is not valid' 
                    }
                }
            },
            securityCode: {
                validators: {
                    cvv: {
                        message: "The CVV number is not valid"
                    }
                }
            },

            cardExpirationMonth: {
                validators: {
                    notEmpty: {
                        message: 'The expiration month is required'
                    },
                    digits: {
                        message: 'The expiration month can contain digits only'
                    },
                    callback: {
                        message: 'Expired',
                        callback: function(value, validator, $field) {
                            value = parseInt(value, 10);
                            var year         = validator.getFieldElements('cardExpirationYear').val(),
                                currentMonth = new Date().getMonth() + 1,
                                currentYear  = new Date().getFullYear();
                            if (value < 0 || value > 12) {
                                return false;
                            }
                            if (year == '') {
                                return true;
                            }
                            year = parseInt(year, 10);
                            if (year > currentYear || (year == currentYear && value >= currentMonth)) {
                                validator.updateStatus('cardExpirationYear', 'VALID');
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            },
            cardExpirationYear: {
                transformer: function($field, validatorName, validator) {
                    var year = parseInt($field.val(), 10);
                    if (isNaN(year)) {
                        return year;
                    } else {
                        return year;
                    }
                },
                validators: {
                    notEmpty: {
                        message: 'The expiration year is required'
                    },
                    digits: {
                        message: 'The expiration year can contain digits only'
                    },
                    callback: {
                        message: 'Expired',
                        callback: function(value, validator, $field) {
                            value = parseInt(value, 10);
                            var month        = validator.getFieldElements('cardExpirationMonth').val(),
                                currentMonth = new Date().getMonth() + 1,
                                currentYear  = new Date().getFullYear();
                            if (value < currentYear || value > currentYear + 10) {
                                return false;
                            }
                            if (month == '') {
                                return false;
                            }
                            month = parseInt(month, 10);
                            if (value > currentYear || (value == currentYear && month >= currentMonth)) {
                                validator.updateStatus('cardExpirationMonth', 'VALID');
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    });
}

load_Country_List = () => {
    var select_country = $("#plan_billing_country");
    $.ajax({
        url: "/dashboard/settings/plan/getCountries",
        type: "POST",
        success: (res) => {
            if (res.result == 0) {
                for (var i = 0; i < res.countries.length; i++) {
                    var opt = $('<option>');
                    opt.val(res.countries[i]);
                    opt.text(res.countries[i]);
                    select_country.append(opt);
                }

                select_country.val("United States");
            }
        }
    });
}

load_Billing_Info = () => {
    $.ajax({
        url: "/dashboard/settings/plan/getBillingInfo",
        type: "POST",
        success: (res) => {
            if (res.result == 0) {
                $("#plan_billing_firstName").val(res.firstName);
                $("#plan_billing_lastName").val(res.lastName);
                $("#plan_billing_companyName").val(res.companyName);
                $("#plan_billing_country").val(res.country);
                $("#plan_billing_address").val(res.address);
                $("#plan_billing_city").val(res.city);
                $("#plan_billing_postalCode").val(res.postalCode);
                $('#plan_billing_month').val(res.cardExpirationMonth);
                $('#plan_billing_year').val(res.cardExpirationYear);
            }
        }
    });
}
$(document).ready(function() {
    initSlide();
    initComponent();
});

initComponent = () => {
    var $body           = $('body');
    var bodyscrolltag   = 'site-is-scroll';
    var bodychangingtag = 'site-scroll-changing';
    var scrollname      = 'navbar-scroll';
    var $instance       = $('.site-navbar');
    var $siteHero       = $('.site-hero.hero');
    var scroll          = false;

    $instance.css('background-color', 'rgba(0, 0, 0, 0.7)');
    $instance.css('z-index', '2000'); 
    $siteHero.css('background-color', 'rgba(0, 0, 0, 0.7)');
    if ($instance.length === 0) {
        return;
    }

    $(document).scroll(function() {
        var top = this.body.scrollTop | this.documentElement.scrollTop;
        if (top > 0) {
            if (!scroll) {
            scroll = true;
            $body.addClass(bodychangingtag);
            // alert("111");
            setTimeout(function() {
                $('body').addClass(bodyscrolltag).removeClass(bodychangingtag);
                $instance.css('background-color', 'rgba(0, 0, 0, 0.7)');
            }, 300);
            }
        } else {
            if (scroll) {
            scroll = false;
            $body.addClass(bodychangingtag);
            setTimeout(function() {
                $('body').removeClass(bodyscrolltag).removeClass(bodychangingtag);
                $instance.css('background-color', 'rgba(0, 0, 0, 0.7)');
            }, 300);
            }
        }
    });

    $("#contactForm").formValidation({
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

    $("#contactForm").unbind("submit").bind("submit", function(e){
        e.preventDefault();
        sendMessage({
            name    : $("#contactForm #name").val(),
            email   : $("#contactForm #email").val(),
            phone   : $("#contactForm #phone").val(),
            message : $("#contactForm #message").val()
        });
    });
}

initSlide = () => {
    $('#more-page').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 1,
        arrows: false,
        variableWidth: true
    });

    $(".slick-track").css("border", "0px");
}
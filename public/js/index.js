$(document).ready(function() {
    var $body           = $('body');
    var bodyscrolltag   = 'site-is-scroll';
    var bodychangingtag = 'site-scroll-changing';
    var scrollname      = 'navbar-scroll';
    var $instance       = $('.site-navbar');
    var $siteHero       = $('.site-hero.hero');
    var scroll          = false;

    $instance.css('background-color', 'rgba(0, 0, 0, 0.7)');
    $siteHero.css('background-color', 'rgba(0, 0, 0, 0.7)');
    if ($instance.length === 0) {
        return;
    }

    $(document).scroll(function() {
        if ($(window).width() < 997) {
            $("body").attr("class", "animsition dashboard site-menubar-hide site-menubar-unfold");
            $("body").css("opacity", "1");
            return;
        }
        var top = this.body.scrollTop | this.documentElement.scrollTop;
        if (top > 0) {
            if (!scroll) {
            scroll = true;
            $body.addClass(bodychangingtag);
            setTimeout(function() {
                $('body').addClass(bodyscrolltag).removeClass(bodychangingtag);
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

    $(".navbar-toggle.hamburger").click(function(){
        if ($(this).hasClass("hided")){
            $(this).removeClass("hided");
            $(".site-menubar").animate({
                left: 0
            }, 300);
            $(".site-body").animate({
                left: 260
            }, 300);
            $("body").addClass("site-menubar-open");
            $("body").css("overflow", "hidden");
        } else {
            $(this).addClass("hided");
            $(".site-menubar").animate({
                left: -260
            }, 300);
            $(".site-body").animate({
                left: 0
            }, 300);
            $("body").removeClass("site-menubar-open");
            $("body").css("overflow", "auto");
        }
    });

    setInterval(function(){
        if ($(".navbar-toggle.hamburger").css("display") == "none") {
            if (!$(".navbar-toggle.hamburger").hasClass("hided")) {
                $(".navbar-toggle.hamburger").addClass("hided");
            }
            $(".site-menubar").css("left", "-260px");
            $(".site-body").css("left", "0px");
        }

        var top = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
        
        if ($(window).width() < 997) {
            if ($body.hasClass("site-menubar-fold")) {
                $body.removeClass("site-menubar-fold");
            }
            $body.addClass("site-menubar-hide");
            $body.addClass("site-menubar-unfold");
            $body.css("opacity", "1");
        } else {
            if ($body.hasClass("site-menubar-hide")) {
                $body.removeClass("site-menubar-hide");
            }
            if ($body.hasClass("site-menubar-unfold")) {
                $body.removeClass("site-menubar-unfold");
            }
            $body.addClass("site-menubar-fold");
            $body.css("opacity", "1");
        }
    }, 50);

    $(".site-menu-item").click(function(){
        var opened = $(this).hasClass("open");
        $(".site-menu-item").each(function(index){
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
            }
        });
        if (!opened) {
            $(this).addClass("open");
        }
    });

    particlesJS.load('particles-js', '/assets/data/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
});

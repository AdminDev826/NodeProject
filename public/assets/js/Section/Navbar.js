/*!
 * remark-frontend v1.0.0 (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';
  var $body = $('body');

  $.modules.register("navbar", {
    bodyscrolltag: 'site-is-scroll',
    bodychangingtag: 'site-scroll-changing',
    scrollname: 'navbar-scroll',
    init: function() {
      var $instance = $('.site-navbar'),
        scroll = false,
        self = this;

      if ($instance.length === 0) {
        return;
      }

      $(document).scroll(function() {
        var top = this.body.scrollTop | this.documentElement.scrollTop;
        if (top > 0) {
          if (!scroll) {
            scroll = true;
            $body.addClass(self.bodychangingtag);
            // alert("111");
            setTimeout(function() {
              $('body').addClass(self.bodyscrolltag).removeClass(self.bodychangingtag);
            }, 300);
          }
        } else {
          if (scroll) {
            scroll = false;
            $body.addClass(self.bodychangingtag);
            setTimeout(function() {
              $('body').removeClass(self.bodyscrolltag).removeClass(self.bodychangingtag);
            }, 300);
          }
        }
      });
    }
  });
})(window, document, jQuery);

window.onload = function(){
    $(".site-menubar-toggle").click();
    $(".btn-site-menubar-toggle").click(function() {
        $(".site-menubar").toggle();
        if ($(".site-menubar").css("display") == "none") {
            $(".page").css("margin-left", "0px");
        } else {
            $(".page").css("margin-left", "90px");
        }
    });
}
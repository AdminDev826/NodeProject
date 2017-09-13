$(document).ready(function(){
    initComponent();
    initEventHandler();
});

function initComponent(){
    $.ajax({
        url     : "/dashboard/settings/apps/getAccountApps",
        type    : "POST",
        success : (res) => {
            if (!res.success) return;
            
            var apps = res.apps;
            for (var i=apps.length-1; i>=0; i--) {
                var appIcon = "fa-map";
                
                if (apps[i].properties.length > 0) {
                    for (var j=0; j<apps[i].properties.length; j++) {
                        if (apps[i].properties[j].name == "app_home_icon") {
                            appIcon = apps[i].properties[j].value;
                        }
                    }    
                }

                var appItem =   '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 m-t-40 app-item">' +
                                    '<div class="bg-light-blue-a400">' +
                                        '<div class="row">' +
                                            '<div class="col-xs-12 m-t-40 m-b-40">' +
                                                '<h3>' +
                                                    '<p class="grey-50" style="width:100%;text-align:center !important;">' +
                                                        '<i class="grey-50 fa fa-3x ' + appIcon + '"></i>' +
                                                    '</p>' +
                                                    '<p class="grey-50" style="width:100%;text-align:center !important;">' +
                                                        '<span class="text-center">' + apps[i].name + '</span>' +
                                                    '</p>' +
                                                '</h3>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div class="row">' +
                                            '<div class="col-xs-12">' +
                                                '<a ' +
                                                    'href="' + apps[i].app_url + '" ' +
                                                    'class="btn btn-block waves-effect waves-light bg-light-blue-800 grey-50">' +
                                                    '<span class="btn-label pull-right"><i class="fa fa-arrow-right"></i></span>' +
                                                '</a>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
  					            '</div>';
                
                $(".page-content.container-fluid").find(".app-container").prepend(appItem);
            }
            initEventHandler();
        }
    });
}

function initEventHandler() {
    $(".app-item").click(function() {
        location.href = $(this).find("a").attr("href");
    });
}

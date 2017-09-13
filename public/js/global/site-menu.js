function getAccountApps(callback){
    $.ajax({
        url     : "/dashboard/settings/apps/getAccountApps",
        type    : "POST",
        success : (res) => {
            if (!res.success) {
                callback(null);
            } else {
                callback(res.apps);
            }
        }
    });
}

function getMonitors(app, callback){
    $.ajax({
        url     : "/apps/locations/getMonitor",
        type    : "POST",
        data    : {appID: app._id},
        success : (res) => {
            if (!res.success) {
                callback(app, []);
            } else {
                callback(app, res.data);
            }
        }
    });
}

$(document).ready(() => {
    getAccountApps(function(apps){
        if (apps) {
            for (var i=apps.length-1; i>=0; i--) {
                getMonitors(apps[i], function(app, monitors){
                    var appIcon = "md-map";
                    for (var j=0; j<app.properties.length; j++) {
                        if (app.properties[j].name == "app_icon") {
                            appIcon = app.properties[j].value;
                        }
                    }
                    var appItem = "";
                    if (monitors.length > 0) {
                        appItem += "<li class='site-menu-item has-sub'>";
                        appItem +=      "<a href='javascript:void(0)'>";
                        appItem +=          "<i class='site-menu-icon " + appIcon + "' aria-hidden='true'></i>";
                        appItem +=          "<span class='site-menu-title'>" + app.name + "</span>";
                        appItem +=          "<span class='site-menu-arrow'></span>";
                        appItem +=      "</a>";
                        appItem +=      "<ul class='site-menu-sub'>";
                    } else {
                        appItem += "<li class='site-menu-item has-sub'>";
                        appItem +=      "<a href='" + app.app_url + "'>";
                        appItem +=          "<i class='site-menu-icon " + appIcon + "' aria-hidden='true'></i>";
                        appItem +=          "<span class='site-menu-title'>" + app.name + "</span>";
                        appItem +=          "<span class='site-menu-arrow'></span>";
                        appItem +=      "</a>";
                    }
                    
                    for (var m=0; m<monitors.length; m++) {
                        var status = monitors[m].status;
                        var style = "";
                        if (status == "P") {
                            style = "badge badge-warning";
                        } else if (status == "A") {
                            style = "badge badge-success";
                        }

                        appItem +=          "<li class='site-menu-item'>";
                        appItem +=              "<a class='animsition-link' href='" + app.app_url + "?mID=" + monitors[m]._id + "'>";
                        appItem +=                  "<span class='site-menu-title'>" + monitors[m].title + "</span>";
                        appItem +=                  "<div class='site-menu-badge'>";
                        appItem +=                      "<span class='" + style + "'>" + status + "</span>";
                        appItem +=                  "</div>";                        
                        appItem +=              "</a>";
                        appItem +=          "</li>"; 
                    }

                    if (monitors.length > 0) {
                        appItem +=      "</ul>";
                        appItem += "</li>";
                    } else {    
                        appItem += "</li>";
                    }
                
                    $(".site-menu-category.apps").after(appItem);
                });
            }
        }
    });
});
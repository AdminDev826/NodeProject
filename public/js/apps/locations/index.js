var map, drawingManager, infoWindow;
var shapes = [];

function initComponent() {
    $("[data-toggle='tooltip']").tooltip(); 
    if (!getParameterByName("mID")) {
        $(".pause-monitor").css("display", "none");
        $(".resume-monitor").css("display", "none");
        $(".delete-monitor").css("display", "none");
    } else {
        $(".btn-search").css("display", "none");
        $(".btn-default-location").css("display", "none");
        getMonitor(getParameterByName("mID"), function(data){
            if (data.status == "A") {
                $(".pause-monitor").css("display", "");
                $(".resume-monitor").css("display", "none");
            } else if (data.status == "P") {
                $(".pause-monitor").css("display", "none");
                $(".resume-monitor").css("display", "");
            }
        });
    }
}

function initEventHandler() {
    $(".sidebar-left-toggler").click(function(){
        if ($(".container-sidebar-left").css("display") == "none") {
            $(".container-sidebar-left").css("display", "block");
            $(".social-feed-container").css("height", ($(".site-menubar-body").css("height").split("px")[0] - 15) + "px");
            var width = parseInt($(".container-page-body").attr("class").split(" ")[0].split("-")[2]);
            $(".container-page-body").attr("class", "col-lg-" + (width-3) + " container-page-body");
            $(this).find(".icon").attr("class", "icon md-caret-left");
        } else {
            $(".container-sidebar-left").css("display", "none");
            $(this).find(".icon").attr("class", "icon md-caret-right");
            var width = parseInt($(".container-page-body").attr("class").split(" ")[0].split("-")[2]);
            $(".container-page-body").attr("class", "col-lg-" + (width+3) + " container-page-body");
        }
    });
    $(".btn-close-sidebar-right").click(function(){
        if ($(".container-sidebar-right").css("display") == "block") {
            $(".container-sidebar-right").css("display", "none");
            var width = parseInt($(".container-page-body").attr("class").split(" ")[0].split("-")[2]);
            $(".container-page-body").attr("class", "col-lg-" + (width+3) + " container-page-body");
            $(".btn-layers").css("background", "rgb(255, 255, 255)");
            $(".btn-layers").css("color", "rgb(117, 117, 117)");
        }
    });
    $(".btn-layers").click(function(){
        $(".container-layers").css("display", "block");
        $(".container-filters").css("display", "none");
        if ($(".container-sidebar-right").css("display") == "none") {
            $(".container-sidebar-right").css("display", "block");
            var width = parseInt($(".container-page-body").attr("class").split(" ")[0].split("-")[2]);
            $(".container-page-body").attr("class", "col-lg-" + (width-3) + " container-page-body");
            $(".btn-layers").css("background", "rgb(100, 190, 255)");
            $(".btn-layers").css("color", "rgb(255, 255, 255)");
        }
    });
    $(".btn-default-location").mousedown(function(){
        setDefaultLocation(function(success){
            if (success) {
                showMessage("Default location is set", "success");
            }
        });
        $(".btn-default-location").css("background", "rgb(100, 190, 255)");
        $(".btn-default-location").css("color", "rgb(255, 255, 255)");
    }).mouseup(function(){
        $(".btn-default-location").css("background", "rgb(255, 255, 255)");
        $(".btn-default-location").css("color", "rgb(117, 117, 117)");
    }); 
    $(".btn-search").mousedown(function(){
        $(".btn-search").css("background", "rgb(100, 190, 255)");
        $(".btn-search").css("color", "rgb(255, 255, 255)");
        $(".sidebar-left-toggler").click();
        createLiveMonitor(function(success, mID){
            if (mID) {
                startLiveMonitor(mID);
            }
        });
    }).mouseup(function(){
        $(".btn-search").css("background", "rgb(255, 255, 255)");
        $(".btn-search").css("color", "rgb(117, 117, 117)");
    }); 
    $(".btn-draw-tools").click(function(){
        if ($(".container-btn-draw-tools").css("display") == "none") {
            $(".container-btn-draw-tools").css("display", "grid");
            $(this).css("background", "rgb(100, 190, 255)");
            $(this).css("color", "rgb(255, 255, 255)");
        } else {
            $(".container-btn-draw-tools").css("display", "none");
            $(this).css("background", "rgb(255, 255, 255)");
            $(this).css("color", "rgb(117, 117, 117)");
        }
    });
    $(".btn-rectangle").click(function(){
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
        $(".container-btn-draw-tools").css("display", "none");
        $(".btn-draw-tools").css("background", "rgb(255, 255, 255)");
        $(".btn-draw-tools").css("color", "rgb(117, 117, 117)");
    });
    $(".btn-circle").click(function(){
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
        $(".container-btn-draw-tools").css("display", "none");
        $(".btn-draw-tools").css("background", "rgb(255, 255, 255)");
        $(".btn-draw-tools").css("color", "rgb(117, 117, 117)");
    });
    $(".btn-polygon").click(function(){
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        $(".container-btn-draw-tools").css("display", "none");
        $(".btn-draw-tools").css("background", "rgb(255, 255, 255)");
        $(".btn-draw-tools").css("color", "rgb(117, 117, 117)");
    });
    $(".btn-remove-all").click(function(){
        $(".container-btn-draw-tools").css("display", "none");
        $(".btn-draw-tools").css("background", "rgb(255, 255, 255)");
        $(".btn-draw-tools").css("color", "rgb(117, 117, 117)");
        removeAllShapes();
    });
    $(".btn-toolbar-save").click(function(){
        $("#saveMonitorModal").modal("toggle");
    });
    $(".btn-toolbar-filter").click(function(){
        $(".container-layers").css("display", "none");
        $(".container-filters").css("display", "block");
        if ($(".container-sidebar-right").css("display") == "none") {
            $(".container-sidebar-right").css("display", "block");
            var width = parseInt($(".container-page-body").attr("class").split(" ")[0].split("-")[2]);
            $(".container-page-body").attr("class", "col-lg-" + (width-3) + " container-page-body");
        }
    });
    $(".btn-toolbar-map-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-map-view").css("display", "block");
    });
    $(".btn-toolbar-list-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-list-view").css("display", "block");
    });
    $(".btn-toolbar-grid-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-grid-view").css("display", "block");
    });
    $(".btn-toolbar-leaderboard-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-leaderboard-view").css("display", "block");
    });
    $(".btn-toolbar-analytics-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-analytics-view").css("display", "block");
    });
    $(".btn-toolbar-trends-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-trends-view").css("display", "block");
    });
    $(".btn-toolbar-custom-view").click(function(){
        $(".page-body").css("display", "none");
        $(".page-custom-view").css("display", "block");
    });
}

function setDefaultLocation(callback){
    $.ajax({
        url: "/apps/locations/setDefaultLocation",
        type: "POST",
        data: {
            latitude: map.getCenter().lat(),
            longitude : map.getCenter().lng(),
            zoom: map.getZoom()
        },
        success: (res) => {
            if (!res.success) {
                callback(false);
            } else {
                callback(true);
            }
        }
    });
}

function getDefaultLocation(callback){
    $.ajax({
        url: "/apps/locations/getDefaultLocation",
        type: "POST",
        success: (res) => {
            if (!res.success) callback(null);
            callback(res.defaultLocation);
        }
    });
}

function removeAllShapes() {
    shapes.forEach(function(shape){
        shape.setMap(null);
    });
    
    shapes = [];
}

function validateShape(shape) {
    var ctr;

    if (shape.type == 'polygon') {
        var bounds = new google.maps.LatLngBounds();
        shape.getPath().forEach(function(element, index) {
            bounds.extend(element)
        });
        ctr = bounds.getCenter();
    } else {
        ctr = shape.getBounds().getCenter();
    } 

    if (shape.type == "circle") {
        if (shape.getRadius() > 5000) {
            shape.setRadius(parseInt(5000, 10));
            showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
        }
        google.maps.event.addListener(shape, "radius_changed", function(event) {
            if (shape.getRadius() > 5000) {
                shape.setRadius(parseInt(5000, 10));
                showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
            }
        });
        google.maps.event.addListener(shape, "center_changed", function(event) {
            setTimeout(function() {
                // if (!mousedown) {
                //     if (centerchangedsampler == 0) {
                //         centerchangedsampler = 1;
                //     } else {
                //         centerchangedsampler = 0;
                //         //loadData();
                //     }
                // }
            }, 10);
        });
    } else if (shape.type == 'rectangle') {
        if (computeRectangleArea(shape.getBounds()) > 50) {
            shape.setMap(null);
            showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
        }
        google.maps.event.addListener(shape, "bounds_changed", function(event) {
            setTimeout(function() {
                // if (!mousedown) {
                //     if (boundschangedsampler == 0) {
                //         boundschangedsampler = 1;
                //     } else {
                //         boundschangedsampler = 0;
                //         if (computeRectangleArea(shape.getBounds()) > 50) {
                //             console.log("Area of the shape cannot be greater than 78.5 square kilometres","danger");
                //             shape.setMap(null);
                //         }
                //     }
                // }
            }, 10);
        });
    } else if (shape.type == 'polygon') {
        if (google.maps.geometry.spherical.computeArea(shape.getPath()) / 1000000 > 50) {
            shape.setMap(null);
            showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
        }
        google.maps.event.addListener(shape, "dragend", function(event) {
            //loadData
        });
        try {
            var path = shape.getPath();
            google.maps.event.addListener(path, 'set_at', function(event) {
                if (google.maps.geometry.spherical.computeArea(this) / 1000000 > 50) {
                    shape.setMap(null);
                    showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
                }
            });
            google.maps.event.addListener(path, 'insert_at', function(event) {
                if (google.maps.geometry.spherical.computeArea(this) / 1000000 > 50) {
                    shape.setMap(null);
                    showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}

function isAreaValid(locations, callback) {
    var bounds = new google.maps.LatLngBounds();
    var locs = locations.split(',');
    var shapes = [];
    var isValid = true;
    for (var i = 0; i < locs.length; i++) {
        if (locs[i].length < 1) continue;
        var l = locs[i].split(':');
        if (l[0] == 'C') {
            var lt = l[1];
            var ln = l[2];
            var rad = parseFloat(l[3]);
            var ctr = new google.maps.LatLng(lt, ln);
            var opts = {
                editable: true,
                draggable: true,
                center: ctr,
                radius: rad
            };
            shape = new google.maps.Circle(opts);
            shape.type = 'circle';
            if (shape.getRadius() > 5000) isValid = false;
        } else if (l[0] == 'R') {
            //'R:' + NE.lat() + ':' + SW.lng() + ':' + SW.lat() + ':' + NE.lng() + ',';
            var n = l[1];
            var w = l[2];
            var s = l[3];
            var e = l[4];
            shape = new google.maps.Rectangle({
                editable: true,
                draggable: true,
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(s, w),
                    new google.maps.LatLng(n, e))
            });
            shape.type = 'rectangle';
            if (computeRectangleArea(shape.getBounds()) > 50)  isValid = false;
        } else if (l[0] == 'P') {
            var ptarr = [];
            var len = parseInt(l[1]) * 2 + 2;
            for (var j = 2; j < len; j++) {
                var coord = new google.maps.LatLng(l[j], l[j + 1]);
                j++;
                ptarr.push(coord);
            }
            var opts = {
                editable: true,
                draggable: true,
                paths: ptarr
            };
            shape = new google.maps.Polygon(opts);
            shape.type = 'polygon';
            if (google.maps.geometry.spherical.computeArea(shape.getPath()) / 1000000 > 50) isValid = false;
        }
        shapes.push(shape);
    }
    callback(isValid, shapes);
}

function showMessage(message, style) {
    $("#messageTrigger1").data("message", message);
    if (style == "success") {
        $("#messageTrigger1").data("icon-class", "toast-just-text toast-success");
    } else if (style == "warning") {
        $("#messageTrigger1").data("icon-class", "toast-just-text toast-warning");
    } else if (style == "danger") {
        $("#messageTrigger1").data("icon-class", "toast-just-text toast-danger");
    }
    $("#messageTrigger1").click();
}

function computeRectangleArea(bounds) {
    if (!bounds) {
        return 0;
    }
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
    var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
    var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
    var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
    return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]) / (1000000);
}

function getLocations() {
    var locations = '';
    for (var i = 0; i < shapes.length; i++) {
        if (shapes[i].type == 'circle') {
            locations += 'C:' + shapes[i].getCenter().lat() + ':' + shapes[i].getCenter().lng() + ':' + shapes[i].getRadius() + ',';
        } else if (shapes[i].type == 'rectangle') {
            var bnds = shapes[i].getBounds();
            var NE = bnds.getNorthEast();
            var SW = bnds.getSouthWest();
            locations += 'R:' + NE.lat() + ':' + SW.lng() + ':' + SW.lat() + ':' + NE.lng() + ',';
        } else if (shapes[i].type == 'polygon') {
            var contentString = '';
            var vertices = shapes[i].getPath();
            locations += 'P:' + vertices.getLength() + ':';
            for (var i = 0; i < vertices.getLength(); i++) {
                var xy = vertices.getAt(i);
                locations += xy.lat() + ':' + xy.lng() + ':';
            }
            locations += ',';
        }
    }
    return locations;
}

function loadLocationDetails(mID, locations) {
    var bounds = new google.maps.LatLngBounds();
    var locs = locations.split(',');
    var shape = [];
    for (var i = 0; i < locs.length; i++) {
        if (locs[i].length < 1) continue;
        var l = locs[i].split(':');
        if (l[0] == 'C') {
            var lt = l[1];
            var ln = l[2];
            var rad = parseFloat(l[3]);
            var ctr = new google.maps.LatLng(lt, ln);
            var opts = {
                editable: true,
                draggable: true,
                map: map,
                center: ctr,
                radius: rad
            };
            shape[i] = new google.maps.Circle(opts);
            shape[i].type = 'circle';

            google.maps.event.addListener(shape[i], "radius_changed", function(event) {
                if (this.getRadius() > 5000) {
                    this.setRadius(parseInt(5000, 10));
                    showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
                }
            });
            bounds.union(shape[i].getBounds());
        } else if (l[0] == 'R') {
            //'R:' + NE.lat() + ':' + SW.lng() + ':' + SW.lat() + ':' + NE.lng() + ',';
            var n = l[1];
            var w = l[2];
            var s = l[3];
            var e = l[4];

            shape[i] = new google.maps.Rectangle({
                editable: true,
                draggable: true,
                map: map,
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(s, w),
                    new google.maps.LatLng(n, e)
                )
            });
            shape[i].type = 'rectangle';
            google.maps.event.addListener(shape[i], "bounds_changed", function(event) {
                var shape = this;
                // setTimeout(function() {
                //     if (!mousedown) {
                //         if (boundschangedsampler == 0) {
                //             boundschangedsampler = 1;
                //         } else {
                //             boundschangedsampler = 0;
                //             if (computeRectangleArea(shape.getBounds()) > 50) {
                //                 showMessage();
                //                 shape.setMap(null);
                //             }
                //         }
                //     }
                // }, 10);
            });
            bounds.union(shape[i].getBounds());
        } else if (l[0] == 'P') {
            var ptarr = [];
            var len = parseInt(l[1]) * 2 + 2;
            for (var j = 2; j < len; j++) {
                var coord = new google.maps.LatLng(l[j], l[j + 1]);
                j++;
                ptarr.push(coord);
            }
            var opts = {
                editable: true,
                draggable: true,
                map: map,
                paths: ptarr
            };
            shape[i] = new google.maps.Polygon(opts);
            shape[i].type = 'polygon';
            shape[i].getPath().forEach(function(element, index) {
                bounds.extend(element)
            });
            var path = shape[i].getPath();
            path.shp = shape[i];
            google.maps.event.addListener(path, 'set_at', function(event) {
                if (google.maps.geometry.spherical.computeArea(this) / 1000000 > 50) {
                    showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
                    this.shp.setMap(null);
                }
            });
            google.maps.event.addListener(path, 'insert_at', function(event) {
                if (google.maps.geometry.spherical.computeArea(this) / 1000000 > 50) {
                    showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
                    this.shp.setMap(null);
                }
            });
        }
        shapes.push(shape[i]);
    }
    map.fitBounds(bounds);
}

function loadData() {
    var mID = getParameterByName("mID");
    if (mID == null) return;

    getMonitor(mID, function(data){
        var style = "";
        if (data.status == "P") {
            style = "badge badge-warning m-l-10";
        } else if (data.status == "A") {
            style = "badge badge-success m-l-10";
        }
        $(".label-live").html(data.title + "<span class='" + style + "'>" + data.status + "</span>");
    });

    loadSavedShape(mID, function(err, locations, isValid){
        //after loaded the saved shape, they should be added at shape global variable.
        //so current monitor can save change shape and locations.
        if (isValid) {
            mID = "DV03mAt2";
            loadLocationDetails(mID, locations);
            loadSavedData(mID);
        } else {
            console.log(err);
        }
    });
}

function loadSavedShape(mID, callback) {
    $.ajax({
        url: "/apps/locations/getMonitor",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (!res.success) {
                callback("server error", false);
            } else {
                isAreaValid(res.data.fetchquery.locations, function(isValid, overlays){
                    if (isValid) {
                        // shapes = overlays;
                        callback(null, res.data.fetchquery.locations, true);
                    } else {
                        callback("Area is not valid", res.data.fetchquery.locations, false);
                    }
                });
            }
        }
    });
}

function loadSavedData(mID) {
    $.ajax({
        url: "/apps/locations/getData",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (!res.success) return;
            
            $(".sidebar-left-toggler").click();
            
            for (var i=0; i<res.data.posts.length; i++) {
                var post = res.data.posts[i];
                processData(post);
            }
            startLiveMonitor(mID);
        }
    });
}

function processData(post){
    if (post.ch == "TW") {
        // processDataTwitter(post.feed);
    } else if (post.ch == "IN") {
        processDataInstagram(post.feed);
    } else if (post.ch == "FB") {
        // processDataFacebook(post.feed);
    } else if (post.ch == "YT") {
        processDataYoutube(post.feed);
    } else if (post.ch == "4S") {
        // processDataFoursquare(post.feed);
    } else if (post.ch == "VK") {
        processDataVk(post.feed);
    } else if (post.ch == "FL") {
        // processDataFlickr(post.feed);
    } else if (post.ch == "PW") {
        // processDataPicasaweb(post.feed);
    } else if (post.ch == "GP") {
        // processDataGoogleplus(post.feed);
    } else if (post.ch == "PX") {
        // processDataPx500(post.feed);
    } else if (post.ch == "GN") {
        // processDataGnip(post.feed);
    } else if (post.ch == "YP") {
        // processDataYelp(post.feed);
    } else if (post.ch == "WB") {
        // processDataWeibo(post.feed);
    } else if (post.ch == "EB") {
        // processDataEventbrite(post.feed);
    } else if (post.ch == "YY") {
        // processDataYikyak(post.feed);
    } else if (post.ch == "PM") {
        // processDataPanoramio(post.feed);
    } else if (post.ch == "MP") {
        // processDataMeetup(post.feed);
    } else if (post.ch == "DM") {
        // processDataDailymotion(post.feed);
    }
}

function getMonitor(mID, callback){
    $.ajax({
        url     : "/apps/locations/getMonitor",
        method  : "POST",
        data    : {mID: mID},
        success : (res) => {
            if (!res.data) return;
            callback(res.data);
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.initGoogleMap = function() {
    initMap(function(){
        realignElements();
        if (!getParameterByName("mID")) {
            getDefaultLocation(function(loc){
                if (loc.zoom) {
                    map.setCenter({
                        lat: loc.latitude,
                        lng: loc.longitude
                    });
                    map.setZoom(loc.zoom);
                } else {
                    initGeoLocation();
                }
            });
        } else {
            loadData();
        }
    });
}

function initMap(callback) {
    var Los_Angeles = {lat: 59.934444444444, lng: 30.330833333333};
    map = new google.maps.Map(document.getElementById('google-map'), {
        center              : Los_Angeles,
        zoom                : 16,
        zoomControl         : true,
        mapTypeControl      : true,
        scaleControl        : true,
        streetViewControl   : true,
        rotateControl       : false,
        fullscreenControl   : false,
        zoomControlOptions  : { 
            position : google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeId   : google.maps.MapTypeId.TERRAIN,
        mapTypeControlOptions: {
            position    : google.maps.ControlPosition.RIGHT_BOTTOM,
            style       : google.maps.MapTypeControlStyle.DEFAULT,
            mapTypeIds  : [
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.TERRAIN
            ]
        }
    });

    window["markerhash"] = [];
    window['bounds_map'] = new google.maps.LatLngBounds();
    
    //Init Drawing Manager
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.RECTANGLE,
                google.maps.drawing.OverlayType.POLYGON,
            ]
        },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
            draggable   : true,
            clickable   : true,
            editable    : true,
            zIndex      : 1
        },
        rectangleOptions: {
            draggable   : true,
            clickable   : true,
            editable    : true,
            zIndex      : 1
        },
        polygonOptions: {
            draggable   : true,
            clickable   : true,
            editable    : true,
            zIndex      : 1
        }
    });

    drawingManager.setMap(map);
    drawingManager.setDrawingMode(null);

    //EventHandler for GoogleMap
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        console.log("google map event - overlaycomplete");
        var newShape    = event.overlay;
        newShape.type   = event.type;
        shapes.push(newShape);
        drawingManager.setDrawingMode(null);
        validateShape(newShape);
        google.maps.event.addListener(newShape, "click", function(event) {
            console.log("load post data");
        });
    });

    //Search address field
    var input = document.getElementById("search-address-box");
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener("places_changed", function() {
        var zoom = map.getZoom();
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        places.forEach(function(place){
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            map.setCenter(place.geometry.location);
            map.setZoom(zoom);
        });
    });
    callback();
}

function showMarkerTooltip(marker) {
    var meta;
    try {
        meta = marker.meta;
    } catch (err) {
        return;
    }
    if (typeof infoWindow === 'undefined') {
        infoWindow = new google.maps.InfoWindow({
            maxWidth: 320,
        });
    }
    var content = "<div class='post-item-container'>";
    content += meta.content;
    content += "</div>";
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

function addPostItemToList(content) {
    if ($(".social-feed-no-data").length > 0) {
        $(".social-feed-no-data").remove();
    }
    $(".social-feed-container").append(content);
}

function initGeoLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
            // handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function realignElements() {
    $("#google-map").css("height", (Number($(".site-menubar").css("height").split("px")[0]) - Number($(".toolbar").css("height").split("px")[0]) + "px"));

    var container = $(".container").clone();
    $("#google-map").prepend(container);
    $(".container")[0].remove();
    
    initComponent();
    initEventHandler();
}

function getShiftedPos(pos) {
    var newLat = pos.lat() + (Math.random() - .1) / 3200; // *(Math.random() * (max - min) + min);
    var newLng = pos.lng() + (Math.random() - .1) / 3200; // *(Math.random() * (max - min) + min);
    pos = new google.maps.LatLng(newLat, newLng);
    return pos;
}

function getShiftedLoc(lt, ln) {
    var pos = new google.maps.LatLng(lt, ln);
    var exists = 'N';
    try {
        exists = window["markerhash"][lt + ':' + ln] + '';
    } catch (err) {}
    if (exists == 'Y')
        pos = getShiftedPos(pos);
    return pos;
}

function getSentiment(data) {
    var sentiment = "";
    if (data == "neg") {
        sentiment = "#f55753";
    } else if (data == "neutral") {
        sentiment = "#10cfbd";
    } else if (data == "pos") {
        sentiment = "#3a8fc8";
    }
    return sentiment;
}

var SOURCES = [];
SOURCES['IN'] = 'INSTAGRAM';
SOURCES['TW'] = 'TWITTER';
SOURCES['FB'] = 'FACEBOOK';
SOURCES['4S'] = 'FOURSQUARE';
SOURCES['YT'] = 'YOUTUBE';
SOURCES['FL'] = 'FLICKR';
SOURCES['GP'] = 'GOOGLEPLUS';
SOURCES['PW'] = 'PICASAWEB';
SOURCES['YY'] = 'YIKYAK';
SOURCES['PN'] = 'PANORAMIO';
SOURCES['PX'] = 'PX500';
SOURCES['MT'] = 'MEETUP';
SOURCES['EB'] = 'EVENTBRITE';
SOURCES['YP'] = 'YELP';
SOURCES['DM'] = 'DAILYMOTION';
SOURCES['VK'] = 'VK';
SOURCES['WB'] = 'WEIBO';

var domain = [];
domain['TWITTER'] = '//twitter.com/';
domain['INSTAGRAM'] = '//instagram.com/';
domain['FACEBOOK'] = '//facebook.com/';
domain['FOURSQUARE'] = '//foursquare.com/';
domain['YOUTUBE'] = '//youtube.com/';
domain['FLICKR'] = '//flickr.com/';
domain['GOOGLEPLUS'] = '//plus.google.com/';
domain['PICASAWEB'] = '//picasaweb.com/';
domain['YIKYAK'] = '//yikyak.com/';
domain['PANORAMIO'] = '//panoramio.com/';
domain['PX500'] = '//500px.com/';
domain['MEETUP'] = '//meetup.com/';
domain['EVENTBRITE'] = '//eventbrite.com/';
domain['YELP'] = '//yelp.com/';
domain['DAILYMOTION'] = '//dailymotion.com/';
domain['VK'] = '//vk.com/';
domain['WEIBO'] = '//weibo.com/';

var mapicon = [];
mapicon['TWITTER'] = '/img/apps/locations/icons/Twitter/1.png';
mapicon['INSTAGRAM'] = '/img/apps/locations/icons/Instagram/1.png';
mapicon['FACEBOOK'] = '/img/apps/locations/icons/Facebook/1.png';
mapicon['FOURSQUARE'] = '/img/apps/locations/icons/Foursquare/1.png';
mapicon['YOUTUBE'] = '/img/apps/locations/icons/Youtube/1.png';
mapicon['FLICKR'] = '/img/apps/locations/icons/Flickr/1.png';
mapicon['GOOGLEPLUS'] = '/img/apps/locations/icons/GooglePlus/1.png';
mapicon['PICASAWEB'] = '/img/apps/locations/icons/GooglePlus/1.png';
mapicon['YIKYAK'] = '/img/apps/locations/icons/YikYak/1.png';
mapicon['PANORAMIO'] = '/img/apps/locations/icons/Panoramio/1.png';
mapicon['PX500'] = '/img/apps/locations/icons/500px/1.png';
mapicon['MEETUP'] = '/img/apps/locations/icons/Meetup/1.png';
mapicon['EVENTBRITE'] = '/img/apps/locations/icons/Eventbrite/1.png';
mapicon['YELP'] = '/img/apps/locations/icons/Yelp/1.png';
mapicon['DAILYMOTION'] = '/img/apps/locations/icons/Dailymotion/1.png';
mapicon['VK'] = '/img/apps/locations/icons/VK/1.png';
mapicon['WEIBO'] = '/img/apps/locations/icons/SinaWeibo/1.png';

var contentIcon = [];
contentIcon['TWITTER'] = '/img/apps/locations/icons/Twitter/3.png';
contentIcon['INSTAGRAM'] = '/img/apps/locations/icons/Instagram/3.png';
contentIcon['FACEBOOK'] = '/img/apps/locations/icons/Facebook/3.png';
contentIcon['FOURSQUARE'] = '/img/apps/locations/icons/Foursquare/3.png';
contentIcon['YOUTUBE'] = '/img/apps/locations/icons/Youtube/3.png';
contentIcon['FLICKR'] = '/img/apps/locations/icons/Flickr/3.png';
contentIcon['GOOGLEPLUS'] = '/img/apps/locations/icons/GooglePlus/3.png';
contentIcon['PICASAWEB'] = '/img/apps/locations/icons/GooglePlus/3.png';
contentIcon['YIKYAK'] = '/img/apps/locations/icons/YikYak/3.png';
contentIcon['PANORAMIO'] = '/img/apps/locations/icons/Panoramio/3.png';
contentIcon['PX500'] = '/img/apps/locations/icons/500px/3.png';
contentIcon['MEETUP'] = '/img/apps/locations/icons/Meetup/3.png';
contentIcon['EVENTBRITE'] = '/img/apps/locations/icons/Eventbrite/3.png';
contentIcon['YELP'] = '/img/apps/locations/icons/Yelp/3.png';
contentIcon['DAILYMOTION'] = '/img/apps/locations/icons/Dailymotion/3.png';
contentIcon['VK'] = '/img/apps/locations/icons/VK/3.png';
contentIcon['WEIBO'] = '/img/apps/locations/icons/SinaWeibo/3.png';


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var props = [];
props['domain_TW'] = 'http://twitter.com';
props['obibUrl_TW'] = '/api/v3/getTwitterNetworkData.jsp';
props['followersUrl_TW'] = '/api/v3/getTwitterFollowers.jsp';
props['followingUrl_TW'] = '/api/v3/getTwitterFollowing.jsp';

props['domain_IN'] = 'http://instagram.com';
props['obibUrl_IN'] = '/api/v3/getInstagramNetworkData.jsp';
props['followersUrl_IN'] = '/api/v3/getInstagramFollowers.jsp';
props['followingUrl_IN'] = '/api/v3/getInstagramFollowing.jsp';

props['domain_FB'] = 'http://facebook.com';
props['followersUrl_FB'] = '/api/v3/getFacebookFriends.jsp';


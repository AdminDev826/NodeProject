function processDataTwitter(data){
    console.log(data);
    var dmn = 'TWITTER';
    var location_info = data.geo;

    var loc = d.geo;
    var lt = '';
    var ln = '';
    var m = '';
    var coords;
    if (loc) {
        coords = loc.coordinates;
        lt = coords[0];
        ln = coords[1];
    }

    var user = d.user;
    var fdatatwitter_entities = d.entities;

    var furls = fdatatwitter_entities.urls;
    var showInstagram = false;
    var showFoursquare = false;
    if (furls && furls.length > 0) {
        var insl = furls[0].expanded_url;
        if (insl.indexOf('instagram.com') != -1) {
            showInstagram = true;
        } else if (insl.indexOf('4sq.com') != -1) {
            showFoursquare = true;
        }
    }

    var fmedia = '';
    var img_h;
    var img_w;
    try {
        fmedia = fdatatwitter_entities.media;
        if (fmedia) {
            for (var q = 0, len2 = fmedia.length; q < len2; q++) {
                //m = fmedia[q].media_url_https + ":thumb";
                m = fmedia[q].media_url_https;
                img_h = fmedia[q].sizes.thumb.h;
                img_w = fmedia[q].sizes.thumb.w;
            }
        } else {
            if (showInstagram) {
                //m = furls[0].expanded_url + 'media/?size=t';
                //img_h = 250;
                //img_w = 250;
            }
        }
    } catch (err) {}
    var un = user.screen_name;
    var t = '';
    var n = user.name;
    var p = user.profile_image_url_https;
    var unurl = domain[dmn] + un;
    var l = unurl + '/status/' + d.id_str;
    try {
        t = d.text;
    } catch (err) {}
    var fd;
    fd = d.created_at;
    var dt = new Date(fd);
    var dstr = dt.toString("MMM dd hh:mm tt");

    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}

    if (loc) {
        var pos = getShiftedLoc(lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn],
            map: map
        });
        window['markerhash'][lt + ':' + ln] = 'Y';
        window['bounds_map'].extend(pos);

        google.maps.event.addListener(marker, 'mouseover', function() {
            // showListPreview(this);
        });
    }
}
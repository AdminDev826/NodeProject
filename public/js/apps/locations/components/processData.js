function processDataDAILYMOTION(data, suffix) {
    console.log(data);
}

function processDataEVENTBRITE(data, suffix) {
    //console.log(data);
    var buf = [];
    var dmn = 'EVENTBRITE';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var venue = d.venue;
    var lt = venue.latitude;
    var ln = venue.longitude;
    var m = '';
    try {
        m = d.logo.url;
    } catch (err) {}
    var un = d.organizer.id;
    var t = '';
    var n = d.name.html;
    var p = '';
    try {
        p = d.logo.url;
    } catch (err) {}
    var l = d.url;
    var unurl = domain[dmn] + 'o/' + un;
    try {
        t = t + d.description.text;
    } catch (err) {}
    var fd;
    fd = d.created;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var pos = getShiftedLoc(suffix, lt, ln);
    var marker = new google.maps.Marker({
        position: pos,
        icon: '' + mapicon[dmn]
    });
    window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
    window['bounds_map_' + suffix].extend(pos);
    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm EB ');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    marker.meta = {};
    marker.meta.lt = lt;
    marker.meta.ln = ln;
    marker.meta.t = t;
    marker.meta.n = n;
    marker.meta.m = m;
    marker.meta.typ = dmn;
    marker.meta.unurl = unurl;
    marker.meta.p = p;
    marker.meta.l = l;
    marker.meta.d = dstr;
    marker.meta.senti = d.senti;
    marker.meta.suffix = suffix;
    marker.meta.content = ghtml;
    marker.meta.mid = mkrid;
    google.maps.event.addListener(marker, 'mouseover', function() {
        showListPreview(this);
    });
    window['markers_map_' + suffix].push(marker);
    try {
        window['map_' + suffix].addMarker(marker);
    } catch (err) {}
    markersQV[marker.meta.mid] = marker;

    addToGrid(buf, suffix);
}

function processDataFACEBOOK(data, suffix) {
    //console.log(data);
    var dmn = 'FACEBOOK';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var place = d.place;
    var photos = d.photos;

    var loc;
    var lt = '';
    var ln = '';

    if (typeof place != 'undefined') {
        loc = place.location;
        lt = loc.latitude;
        ln = loc.longitude;
    }

    var buf = [];
    if (typeof photos != 'undefined') {
        for (i = 0; i < photos.length; i++) {
            buf = [];
            var photo = photos[i];
            var m = '';
            var user = photo.from;
            try {
                m = photo.picture;
            } catch (err) {}
            var un = user.id;
            var t = '';
            var n = user.name;
            var p = photo.icon;
            var l = photo.link;
            var unurl = domain[dmn] + un;
            try {
                t = photo.name;
            } catch (err) {}
            var fd;
            fd = photo.created_time;
            var dt = new Date(fd);
            dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
                ':' + dt.getMinutes());
            var dstr = dt.toString("MMM dd hh:mm");

            try {
                if (lt == '' && ln == '') {
                    lt = photo.latitude;
                    ln = photo.longitude;
                }
            } catch (err) {}

            var pos = getShiftedLoc(suffix, lt, ln);
            var marker = new google.maps.Marker({
                position: pos,
                icon: '' + mapicon[dmn]
            });
            window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
            window['bounds_map_' + suffix].extend(pos);
            var senti = getSenti(dmn, photo);
            var sprobpos = 0;
            var sprobneg = 0;
            var sprobneutral = 0;
            try {
                var sprob = d.senti.probability;
                sprobpos = sprob.pos;
                sprobneg = sprob.neg;
                sprobneutral = sprob.neutral;
            } catch (err) {}
            var mkrid = getQuickUid();
            buf.push('<div class="itm FB image ');
            buf.push(senti);
            buf.push('" dt=');
            buf.push(dt.getTime());
            buf.push(' st=');
            buf.push(sprobneg);

            buf.push(' mid=');
            buf.push(mkrid);
            buf.push('><div class="');
            buf.push(senti);
            buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
            buf.push(p);
            buf.push(' />');
            buf.push('<div><a class=pull-right target=_blank href=');
            buf.push(unurl);
            buf.push('><img class="m-r-10" width=18 src=');
            buf.push(mapicon[dmn]);
            buf.push(' />');
            buf.push('</a><a target=_blank href=');
            buf.push(unurl);
            buf.push(' >');
            buf.push('<h6 class="text-white bold">');
            buf.push(n);
            buf.push('</h6></div>');
            buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
            buf.push(dstr);
            buf.push('</p></div><div><a target=_blank href=' + l + ' >');
            if (m && m.length > 1) {
                buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / photo.width * photo.height + ' />');
            }
            buf.push('</a></div><div><a target=_blank href=');
            buf.push(l);
            buf.push('><div class="padding-10"><p class="f12">');
            buf.push(t);
            buf.push('</p></div></a></div>');

            if (!widget) {
                buf.push('<div class=padding-5>');
                buf.push('<button class="btn btn-xs ');
                if (lt != '') {
                    buf.push('btn-complete" onclick="loc(');
                    buf.push(lt);
                    buf.push(',');
                    buf.push(ln);
                    buf.push(');return false;"');
                } else {
                    buf.push('" onclick="nolo();"');
                }
                buf.push('><i class="fa fa-map-marker"></i></button></div>');
            }
            buf.push('</div>');

            var ghtml = buf.join("");
            if (suffix == 'main') {
                var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
                addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
            }
            marker.meta = {};
            marker.meta.lt = lt;
            marker.meta.ln = ln;
            marker.meta.t = t;
            marker.meta.n = n;
            marker.meta.m = m;
            marker.meta.typ = dmn;
            marker.meta.unurl = unurl;
            marker.meta.p = p;
            marker.meta.l = l;
            marker.meta.d = dstr;
            marker.meta.senti = d.senti;
            marker.meta.suffix = suffix;
            marker.meta.content = ghtml;
            marker.meta.mid = mkrid;
            google.maps.event.addListener(marker, 'mouseover', function() {
                showListPreview(this);
            });

            window['markers_map_' + suffix].push(marker);
            try {
                window['map_' + suffix].addMarker(marker);
            } catch (err) {}
            markersQV[marker.meta.mid] = marker;


            addToGrid(buf, suffix);
        }
        addCounter(dmn, photos.length);
    } else {
        //Saved FB data
        buf = [];
        var m = '';
        var user = d.from;
        try {
            m = d.picture;
        } catch (err) {
            m = '';
        }
        var un = user.id;
        var t = '';
        var n = user.name;
        var p = d.icon;
        var l = d.link;
        var unurl = domain[dmn] + un;
        try {
            t = d.name;
        } catch (err) {
            t = '';
        }
        var fd;
        fd = d.created_time;
        var dt = new Date(fd);
        dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
            ':' + dt.getMinutes());
        var dstr = dt.toString("MMM dd hh:mm");

        try {
            if (lt == '' && ln == '') {
                loc = d.location;
                if (loc) {
                    lt = loc.latitude;
                    ln = loc.longitude;
                }
            }
        } catch (err) {}

        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);
        var senti = getSenti(dmn, d);
        var sprobpos = 0;
        var sprobneg = 0;
        var sprobneutral = 0;
        try {
            var sprob = d.senti.probability;
            sprobpos = sprob.pos;
            sprobneg = sprob.neg;
            sprobneutral = sprob.neutral;
        } catch (err) {}
        var mkrid = getQuickUid();

        buf.push('<div class="itm ');
        buf.push('FB image');
        buf.push(senti);
        buf.push('" dt=');
        buf.push(dt.getTime());
        buf.push(' st=');
        buf.push(sprobneg);

        buf.push(' mid=');
        buf.push(mkrid);
        buf.push('><div class="');
        buf.push(senti);
        buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
        buf.push(p);
        buf.push(' />');
        buf.push('<div><a class=pull-right target=_blank href=');
        buf.push(unurl);
        buf.push('><img class="m-r-10" width=18 src=');
        buf.push(mapicon[dmn]);
        buf.push(' />');
        buf.push('</a><a target=_blank href=');
        buf.push(unurl);
        buf.push(' >');
        buf.push('<h6 class="text-white bold">');
        buf.push(n);
        buf.push('</h6></div>');
        buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
        buf.push(dstr);
        buf.push('</p></div><div><a target=_blank href=' + l + ' >');
        if (m && m.length > 1) {
            buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / d.width * d.height + ' />');
        }
        buf.push('</a></div><div><a target=_blank href=');
        buf.push(l);
        buf.push('><div class="padding-10"><p class="f12">');
        buf.push(t);
        buf.push('</p></div></a></div>');

        if (!widget) {
            buf.push('<div class=padding-5>');
            buf.push('<button class="btn btn-xs ');
            if (lt != '') {
                buf.push('btn-complete" onclick="loc(');
                buf.push(lt);
                buf.push(',');
                buf.push(ln);
                buf.push(');return false;"');
            } else {
                buf.push('" onclick="nolo();"');
            }
            buf.push('><i class="fa fa-map-marker"></i></button></div>');
        }
        buf.push('</div>');

        var ghtml = buf.join("");
        if (suffix == 'main') {
            var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
            addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
        }

        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;

        addToGrid(buf, suffix);
    } // Saved FB end
}

function processDataFOURSQUARE(data, suffix) {
    try {
        var dmn = 'FOURSQUARE';
        var d;
        if (data.data) {
            d = data.data;
        } else {
            d = data;
        }
        var place = d.venue;
        var photos = d.photos;
        var tips = d.tips;
        var loc;
        var lt;
        var ln;
        var buf = [];

        try {
            loc = place.location;
            lt = loc.lat;
            ln = loc.lng;
        } catch (err) {}

        if (typeof photos != 'undefined') {
            for (i = 0; i < photos.length; i++) {
                buf = [];
                var photo = photos[i];
                var m = '';
                var user = photo.user;
                try {
                    m = photo.prefix + '100x100' + photo.suffix;
                } catch (err) {}
                var un = user.id;
                var t = place.name;
                var n = user.firstName + ' ' + user.lastName;
                var p = user.photo.prefix + '36x36' + user.photo.suffix;
                var l = domain[dmn] + 'v/' + place.id;
                var unurl = domain[dmn] + 'user/' + un;
                try {
                    t = t;
                } catch (err) {}
                var fd;
                fd = photo.createdAt * 1000;
                var dt = new Date(fd);
                dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
                    ':' + dt.getMinutes());
                var dstr = dt.toString("MMM dd hh:mm tt");

                var pos = getShiftedLoc(suffix, lt, ln);
                var marker = new google.maps.Marker({
                    position: pos,
                    icon: '' + mapicon[dmn]
                });
                window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
                window['bounds_map_' + suffix].extend(pos);
                var senti = getSenti(dmn, photo);
                var sprobpos = 0;
                var sprobneg = 0;
                var sprobneutral = 0;
                try {
                    var sprob = d.senti.probability;
                    sprobpos = sprob.pos;
                    sprobneg = sprob.neg;
                    sprobneutral = sprob.neutral;
                } catch (err) {}
                var mkrid = getQuickUid();

                buf.push('<div class="itm 4S image');
                buf.push(senti);
                buf.push('" dt=');
                buf.push(dt.getTime());
                buf.push(' st=');
                buf.push(sprobneg);

                buf.push(' mid=');
                buf.push(mkrid);
                buf.push('><div class="');
                buf.push(senti);
                buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
                buf.push(p);
                buf.push(' />');
                buf.push('<div><a class=pull-right target=_blank href=');
                buf.push(unurl);
                buf.push('><img class="m-r-10" width=18 src=');
                buf.push(mapicon[dmn]);
                buf.push(' />');
                buf.push('</a><a target=_blank href=');
                buf.push(unurl);
                buf.push(' >');
                buf.push('<h6 class="text-white bold">');
                buf.push(n);
                buf.push('</h6></div>');
                buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
                buf.push(dstr);
                buf.push('</p></div><div><a target=_blank href=' + l + ' >');
                if (m && m.length > 1) {
                    buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / photo.width * photo.height + ' />');
                }
                buf.push('</a></div><div><a target=_blank href=');
                buf.push(l);
                buf.push('><div class="padding-10"><p class="f12">');
                buf.push(t);
                buf.push('</p></div></a></div>');

                if (!widget) {
                    buf.push('<div class=padding-5>');
                    buf.push('<button class="btn btn-xs ');
                    if (lt != '') {
                        buf.push('btn-complete" onclick="loc(');
                        buf.push(lt);
                        buf.push(',');
                        buf.push(ln);
                        buf.push(');return false;"');
                    } else {
                        buf.push('" onclick="nolo();"');
                    }
                    buf.push('><i class="fa fa-map-marker"></i></button></div>');
                }
                buf.push('</div>');

                var ghtml = buf.join("");
                if (suffix == 'main') {
                    var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
                    addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
                }

                marker.meta = {};
                marker.meta.lt = lt;
                marker.meta.ln = ln;
                marker.meta.t = t;
                marker.meta.n = n;
                marker.meta.m = m;
                marker.meta.typ = dmn;
                marker.meta.unurl = unurl;
                marker.meta.p = p;
                marker.meta.l = l;
                marker.meta.d = dstr;
                marker.meta.senti = d.senti;
                marker.meta.suffix = suffix;
                marker.meta.content = ghtml;
                marker.meta.mid = mkrid;
                google.maps.event.addListener(marker, 'mouseover', function() {
                    showListPreview(this);
                });

                window['markers_map_' + suffix].push(marker);
                try {
                    window['map_' + suffix].addMarker(marker);
                } catch (err) {}
                markersQV[marker.meta.mid] = marker;

                addToGrid(buf, suffix);
            }
            addCounter(dmn, photos.length);
        } else {

            buf = [];
            var photo = d;
            try {
                loc = photo.location;
                lt = loc.lat;
                ln = loc.lng;
            } catch (err) {}
            var m = '';
            var user = photo.user;
            try {
                m = photo.prefix + '100x100' + photo.suffix;
            } catch (err) {}
            var un = user.id;
            var t = place.name;
            var n = user.firstName + ' ' + user.lastName;
            var p = user.photo.prefix + '36x36' + user.photo.suffix;
            var l = domain[dmn] + 'v/' + place.id;
            var unurl = domain[dmn] + 'user/' + un;
            try {
                t = t;
            } catch (err) {}
            var fd;
            fd = photo.createdAt * 1000;
            var dt = new Date(fd);
            dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
                ':' + dt.getMinutes());
            var dstr = dt.toString("MMM dd hh:mm tt");

            var pos = getShiftedLoc(suffix, lt, ln);
            var marker = new google.maps.Marker({
                position: pos,
                icon: '' + mapicon[dmn]
            });
            window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
            window['bounds_map_' + suffix].extend(pos);
            var senti = getSenti(dmn, photo);
            var sprobpos = 0;
            var sprobneg = 0;
            var sprobneutral = 0;
            try {
                var sprob = d.senti.probability;
                sprobpos = sprob.pos;
                sprobneg = sprob.neg;
                sprobneutral = sprob.neutral;
            } catch (err) {}
            var mkrid = getQuickUid();

            buf.push('<div class="itm 4S image');
            buf.push(senti);
            buf.push('" dt=');
            buf.push(dt.getTime());
            buf.push(' st=');
            buf.push(sprobneg);

            buf.push(' mid=');
            buf.push(mkrid);
            buf.push('><div class="');
            buf.push(senti);
            buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
            buf.push(p);
            buf.push(' />');
            buf.push('<div><a class=pull-right target=_blank href=');
            buf.push(unurl);
            buf.push('><img class="m-r-10" width=18 src=');
            buf.push(mapicon[dmn]);
            buf.push(' />');
            buf.push('</a><a target=_blank href=');
            buf.push(unurl);
            buf.push(' >');
            buf.push('<h6 class="text-white bold">');
            buf.push(n);
            buf.push('</h6></div>');
            buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
            buf.push(dstr);
            buf.push('</p></div><div><a target=_blank href=' + l + ' >');
            if (m && m.length > 1) {
                buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / photo.width * photo.height + ' />');
            }
            buf.push('</a></div><div><a target=_blank href=');
            buf.push(l);
            buf.push('><div class="padding-10"><p class="f12">');
            buf.push(t);
            buf.push('</p></div></a></div>');

            if (!widget) {
                buf.push('<div class=padding-5>');
                buf.push('<button class="btn btn-xs ');
                if (lt != '') {
                    buf.push('btn-complete" onclick="loc(');
                    buf.push(lt);
                    buf.push(',');
                    buf.push(ln);
                    buf.push(');return false;"');
                } else {
                    buf.push('" onclick="nolo();"');
                }
                buf.push('><i class="fa fa-map-marker"></i></button></div>');
            }
            buf.push('</div>');

            var ghtml = buf.join("");
            if (suffix == 'main') {
                var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
                addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
            }

            marker.meta = {};
            marker.meta.lt = lt;
            marker.meta.ln = ln;
            marker.meta.t = t;
            marker.meta.n = n;
            marker.meta.m = m;
            marker.meta.typ = dmn;
            marker.meta.unurl = unurl;
            marker.meta.p = p;
            marker.meta.l = l;
            marker.meta.d = dstr;
            marker.meta.senti = d.senti;
            marker.meta.suffix = suffix;
            marker.meta.content = ghtml;
            marker.meta.mid = mkrid;
            google.maps.event.addListener(marker, 'mouseover', function() {
                showListPreview(this);
            });

            window['markers_map_' + suffix].push(marker);
            try {
                window['map_' + suffix].addMarker(marker);
            } catch (err) {}
            markersQV[marker.meta.mid] = marker;

            addToGrid(buf, suffix);


        }

        if (typeof tips != 'undefined') {
            for (i = 0; i < tips.length; i++) {
                buf = [];
                var tip = tips[i];
                var m = '';
                var user = tip.user;
                try {
                    if (typeof tip.prefix != 'undefined')
                        m = tip.prefix + '100x100' + tip.suffix;
                } catch (err) {}
                var un = user.id;
                var t = place.name;
                var n = user.firstName + ' ' + user.lastName;
                var p = user.photo.prefix + '36x36' + user.photo.suffix;
                var l = domain[dmn] + 'v/' + place.id;
                var unurl = domain[dmn] + 'user/' + un;
                try {
                    t = t + '<br />' + tip.text;
                } catch (err) {}
                var fd;
                fd = tip.createdAt * 1000;
                var dt = new Date(fd);
                dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
                    ':' + dt.getMinutes());
                var dstr = dt.toString("MMM dd hh:mm tt");

                var pos = getShiftedLoc(suffix, lt, ln);
                var marker = new google.maps.Marker({
                    position: pos,
                    icon: '' + mapicon[dmn]
                });
                window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
                window['bounds_map_' + suffix].extend(pos);
                var senti = getSenti(dmn, tip);
                var sprobpos = 0;
                var sprobneg = 0;
                var sprobneutral = 0;
                try {
                    var sprob = d.senti.probability;
                    sprobpos = sprob.pos;
                    sprobneg = sprob.neg;
                    sprobneutral = sprob.neutral;
                } catch (err) {}
                var mkrid = getQuickUid();

                buf.push('<div class="itm 4S tips');
                buf.push(senti);
                buf.push('" dt=');
                buf.push(dt.getTime());
                buf.push(' st=');
                buf.push(sprobneg);

                buf.push(' mid=');
                buf.push(mkrid);
                buf.push('><div class="');
                buf.push(senti);
                buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
                buf.push(p);
                buf.push(' />');
                buf.push('<div><a class=pull-right target=_blank href=');
                buf.push(unurl);
                buf.push('><img class="m-r-10" width=18 src=');
                buf.push(mapicon[dmn]);
                buf.push(' />');
                buf.push('</a><a target=_blank href=');
                buf.push(unurl);
                buf.push(' >');
                buf.push('<h6 class="text-white bold">');
                buf.push(n);
                buf.push('</h6></div>');
                buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
                buf.push(dstr);
                buf.push('</p></div><div><a target=_blank href=' + l + ' >');
                if (m && m.length > 1) {
                    buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
                }
                buf.push('</a></div><div><a target=_blank href=');
                buf.push(l);
                buf.push('><div class="padding-10"><p class="f12">');
                buf.push(t);
                buf.push('</p></div></a></div>');

                if (!widget) {
                    buf.push('<div class=padding-5>');
                    buf.push('<button class="btn btn-xs ');
                    if (lt != '') {
                        buf.push('btn-complete" onclick="loc(');
                        buf.push(lt);
                        buf.push(',');
                        buf.push(ln);
                        buf.push(');return false;"');
                    } else {
                        buf.push('" onclick="nolo();"');
                    }
                    buf.push('><i class="fa fa-map-marker"></i></button></div>');
                }
                buf.push('</div>');

                var ghtml = buf.join("");
                if (suffix == 'main') {
                    var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
                    addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
                }

                marker.meta = {};
                marker.meta.lt = lt;
                marker.meta.ln = ln;
                marker.meta.t = t;
                marker.meta.n = n;
                marker.meta.m = m;
                marker.meta.typ = dmn;
                marker.meta.unurl = unurl;
                marker.meta.p = p;
                marker.meta.l = l;
                marker.meta.d = dstr;
                marker.meta.senti = d.senti;
                marker.meta.suffix = suffix;
                marker.meta.content = ghtml;
                marker.meta.mid = mkrid;
                google.maps.event.addListener(marker, 'mouseover', function() {
                    showListPreview(this);
                });

                window['markers_map_' + suffix].push(marker);
                try {
                    window['map_' + suffix].addMarker(marker);
                } catch (err) {}
                markersQV[marker.meta.mid] = marker;

                addToGrid(buf, suffix);
            }
            addCounter(dmn, tips.length);
        } else {

            buf = [];
            var tip = d;
            try {
                loc = tip.location;
                lt = loc.lat;
                ln = loc.lng;
            } catch (err) {}
            var m = '';
            var user = tip.user;
            try {
                if (typeof tip.prefix != 'undefined')
                    m = tip.prefix + '100x100' + tip.suffix;
            } catch (err) {}
            var un = user.id;
            var t = place.name;
            var n = user.firstName + ' ' + user.lastName;
            var p = user.photo.prefix + '36x36' + user.photo.suffix;
            var l = domain[dmn] + 'v/' + place.id;
            var unurl = domain[dmn] + 'user/' + un;
            try {
                t = t + '<br />' + tip.text;
            } catch (err) {}
            var fd;
            fd = tip.createdAt * 1000;
            var dt = new Date(fd);
            dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
                ':' + dt.getMinutes());
            var dstr = dt.toString("MMM dd hh:mm tt");

            var pos = getShiftedLoc(suffix, lt, ln);
            var marker = new google.maps.Marker({
                position: pos,
                icon: '' + mapicon[dmn]
            });
            window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
            window['bounds_map_' + suffix].extend(pos);
            var senti = getSenti(dmn, tip);
            var sprobpos = 0;
            var sprobneg = 0;
            var sprobneutral = 0;
            try {
                var sprob = d.senti.probability;
                sprobpos = sprob.pos;
                sprobneg = sprob.neg;
                sprobneutral = sprob.neutral;
            } catch (err) {}
            var mkrid = getQuickUid();

            buf.push('<div class="itm 4S tips');
            buf.push(senti);
            buf.push('" dt=');
            buf.push(dt.getTime());
            buf.push(' st=');
            buf.push(sprobneg);

            buf.push(' mid=');
            buf.push(mkrid);
            buf.push('><div class="');
            buf.push(senti);
            buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
            buf.push(p);
            buf.push(' />');
            buf.push('<div><a class=pull-right target=_blank href=');
            buf.push(unurl);
            buf.push('><img class="m-r-10" width=18 src=');
            buf.push(mapicon[dmn]);
            buf.push(' />');
            buf.push('</a><a target=_blank href=');
            buf.push(unurl);
            buf.push(' >');
            buf.push('<h6 class="text-white bold">');
            buf.push(n);
            buf.push('</h6></div>');
            buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
            buf.push(dstr);
            buf.push('</p></div><div><a target=_blank href=' + l + ' >');
            if (m && m.length > 1) {
                buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
            }
            buf.push('</a></div><div><a target=_blank href=');
            buf.push(l);
            buf.push('><div class="padding-10"><p class="f12">');
            buf.push(t);
            buf.push('</p></div></a></div>');

            if (!widget) {
                buf.push('<div class=padding-5>');
                buf.push('<button class="btn btn-xs ');
                if (lt != '') {
                    buf.push('btn-complete" onclick="loc(');
                    buf.push(lt);
                    buf.push(',');
                    buf.push(ln);
                    buf.push(');return false;"');
                } else {
                    buf.push('" onclick="nolo();"');
                }
                buf.push('><i class="fa fa-map-marker"></i></button></div>');
            }
            buf.push('</div>');

            var ghtml = buf.join("");
            if (suffix == 'main') {
                var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
                addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
            }

            marker.meta = {};
            marker.meta.lt = lt;
            marker.meta.ln = ln;
            marker.meta.t = t;
            marker.meta.n = n;
            marker.meta.m = m;
            marker.meta.typ = dmn;
            marker.meta.unurl = unurl;
            marker.meta.p = p;
            marker.meta.l = l;
            marker.meta.d = dstr;
            marker.meta.senti = d.senti;
            marker.meta.suffix = suffix;
            marker.meta.content = ghtml;
            marker.meta.mid = mkrid;
            google.maps.event.addListener(marker, 'mouseover', function() {
                showListPreview(this);
            });

            window['markers_map_' + suffix].push(marker);
            try {
                window['map_' + suffix].addMarker(marker);
            } catch (err) {}
            markersQV[marker.meta.mid] = marker;

            addToGrid(buf, suffix);


        }

    } catch (err) {
        console.log('processDataFoursquare error');
        console.log(err);
    }

}

function processDataFLICKR(data, suffix) {
    var dmn = 'FLICKR';
    var buf = [];
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var lt = d.latitude;
    var ln = d.longitude;
    var m = 'https://farm' + d.farm + '.staticflickr.com/' + d.server + '/' + d.id + '_' + d.secret + '_s.jpg';
    var un = d.owner;
    var t = '';
    var n = d.owner;
    var p = '';
    var l = 'https://www.flickr.com/photos/' + d.owner + '/' + d.id;
    var unurl = domain[dmn] + un;
    try {
        t = d.title;
        t = t + d.description._content;
    } catch (err) {}
    var dstr = d.datetaken;

    var pos = getShiftedLoc(suffix, lt, ln);
    var marker = new google.maps.Marker({
        position: pos,
        icon: '' + mapicon[dmn]
    });
    window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
    window['bounds_map_' + suffix].extend(pos);
    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm FL image');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(new Date(dstr).getMilliseconds());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold m-l-10">User Id:');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    marker.meta = {};
    marker.meta.lt = lt;
    marker.meta.ln = ln;
    marker.meta.t = t;
    marker.meta.n = n;
    marker.meta.m = m;
    marker.meta.typ = dmn;
    marker.meta.unurl = unurl;
    marker.meta.p = p;
    marker.meta.l = l;
    marker.meta.d = dstr;
    marker.meta.senti = d.senti;
    marker.meta.suffix = suffix;
    marker.meta.content = ghtml;
    marker.meta.mid = mkrid;
    google.maps.event.addListener(marker, 'mouseover', function() {
        showListPreview(this);
    });
    window['markers_map_' + suffix].push(marker);
    try {
        window['map_' + suffix].addMarker(marker);
    } catch (err) {}
    markersQV[marker.meta.mid] = marker;

    addToGrid(buf, suffix);

}

function processDataGOOGLEPLUS(data, suffix) {
    console.log(data);
}

function processDataINSTAGRAM(data, suffix) {
    //console.log(data);
    var buf = [];
    var dmn = 'INSTAGRAM';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var meta;
    try {
        meta = data.meta;
    } catch (err) {}
    var loc = d.location;
    var lt = '';
    var ln = '';
    if (loc) {
        ln = loc.longitude;
        lt = loc.latitude;
    }
    var user = d.user;
    var m = d.images.standard_resolution.url;
    var un = user.username;
    var t = '';
    var n = user.full_name;
    var p = user.profile_picture;
    var l = d.link;
    var unurl = domain[dmn] + un;
    try {
        t = d.caption.text;
    } catch (err) {}
    var fd;
    fd = d.created_time * 1000;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm IN ');
    buf.push(senti);
    buf.push(' ');
    buf.push(d.type);
    buf.push(' " dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-5 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' /><img class="pull-right m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('<a target=_blank href=');
    buf.push(unurl);
    buf.push(' uid=');
    buf.push(user.id);
    buf.push(' pid=');
    buf.push(d.id);
    buf.push(' ts=');
    try {
        buf.push(meta.ts);
    } catch (err) {}
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p>');

    buf.push('<p class="m-l-5"><i class="fa fa-users"></i>');
    try {
        buf.push(d.usercounts[0].followed_by);
    } catch (err) {
        buf.push('0');
    }
    buf.push(' <i class="fa fa-heart"></i>');
    buf.push(d.likes.count);
    buf.push(' <i class="fa fa-comments"></i>');
    buf.push(d.comments.count);
    buf.push('</p>');

    buf.push('</div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a><a target=_blank href=');
    buf.push(l);
    buf.push('><p class="padding-10 f12">');
    buf.push(t);
    buf.push('</p></a>');

    if (!widget) {
        buf.push('<button type="TRUE_IN" class="m-l-5 m-b-5 btn btn-xs btn-complete">TrueId</button> ');
        //buf.push('<button type="E_IN" class="m-l-5 m-b-5 btn btn-xs btn-complete"><i class="fa fa-bullhorn"></i></button> ');
        buf.push('<button class="m-b-5 btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button>');

        try {
            if (meta.faved == 'Y') buf.push(' <span class="badge badge-warning">Favorited</span> ');
        } catch (err) {}
        try {
            if (meta.liked == 'Y') buf.push(' <span class="badge badge-warning">Liked</span> ');
        } catch (err) {}
        try {
            if (meta.commented == 'Y') buf.push(' <span class="badge badge-warning">Replied</span> ');
        } catch (err) {}
        try {
            if (meta.followed == 'Y') buf.push(' <span class="badge badge-warning">Followed</span> ');
        } catch (err) {}


    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt == '') {
        //console.log('Marker not added' + lt + ':' + ln);
        //console.log(loc);
    } else {
        //console.log('Marker added' + lt + ':' + ln);
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        marker.meta = {};
        var mm = marker.meta;
        mm.lt = lt;
        mm.ln = ln;
        mm.t = t;
        mm.n = n;
        mm.m = m;
        mm.typ = dmn;
        mm.unurl = unurl;
        mm.p = p;
        mm.l = l;
        mm.d = dstr;
        mm.senti = d.senti;
        mm.suffix = suffix;
        mm.content = ghtml;
        mm.mid = mkrid;
        mm = mm;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });
        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;

    }

    addToGrid(buf, suffix);
}

function processDataMEETUP(data, suffix) {
    //console.log(data);
    var dmn = 'MEETUP';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var place = d.group;
    var photos = d.photos;
    var loc = d.group;
    var lt = loc.lat;
    var ln = loc.lon;
    var buf = [];
    for (i = 0; i < photos.length; i++) {
        buf = [];
        var photo = photos[i];
        var m = '';
        var user = photo.member;
        try {
            m = photo.photo_link;
        } catch (err) {}
        var un = user.member_id;
        var t = place.name;
        var n = user.name;
        var p = 'http://photos3.meetupstatic.com/photos/member/thumb_' + un + '.jpeg';
        var l = photo.photo_link;
        var unurl = domain[dmn] + 'members/' + un;
        try {
            t = t;
        } catch (err) {}
        var fd;
        fd = photo.created;
        var dt = new Date(fd);
        dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() +
            ':' + dt.getMinutes());
        var dstr = dt.toString("MMM dd hh:mm tt");

        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        var senti = getSenti(dmn, photo);
        var sprobpos = 0;
        var sprobneg = 0;
        var sprobneutral = 0;
        try {
            var sprob = d.senti.probability;
            sprobpos = sprob.pos;
            sprobneg = sprob.neg;
            sprobneutral = sprob.neutral;
        } catch (err) {}
        var mkrid = getQuickUid();

        buf.push('<div class="itm MT ');
        buf.push(senti);
        buf.push('" dt=');
        buf.push(dt.getTime());
        buf.push(' st=');
        buf.push(sprobneg);

        buf.push(' mid=');
        buf.push(mkrid);
        buf.push('><div class="');
        buf.push(senti);
        buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
        buf.push(p);
        buf.push(' />');
        buf.push('<div><a class=pull-right target=_blank href=');
        buf.push(unurl);
        buf.push('><img class="m-r-10" width=18 src=');
        buf.push(mapicon[dmn]);
        buf.push(' />');
        buf.push('</a><a target=_blank href=');
        buf.push(unurl);
        buf.push(' >');
        buf.push('<h6 class="text-white bold">');
        buf.push(n);
        buf.push('</h6><h6 class="text-white bold">');
        buf.push(un);
        buf.push('</h6></div>');
        buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
        buf.push(dstr);
        buf.push('</p></div><div><a target=_blank href=' + l + ' >');
        if (m && m.length > 1) {
            buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
        }
        buf.push('</a></div><div><a target=_blank href=');
        buf.push(l);
        buf.push('><div class="padding-10"><p class="f12">');
        buf.push(t);
        buf.push('</p></div></a></div>');

        if (!widget) {
            buf.push('<div class=padding-5>');
            buf.push('<button class="btn btn-xs ');
            if (lt != '') {
                buf.push('btn-complete" onclick="loc(');
                buf.push(lt);
                buf.push(',');
                buf.push(ln);
                buf.push(');return false;"');
            } else {
                buf.push('" onclick="nolo();"');
            }
            buf.push('><i class="fa fa-map-marker"></i></button></div>');
        }
        buf.push('</div>');

        var ghtml = buf.join("");
        if (suffix == 'main') {
            var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
            addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
        }

        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;

        addToGrid(buf, suffix);
    }
    addCounter(dmn, photos.length);
}

function processDataPANORAMIO(data, suffix) {
    var buf = [];
    var dmn = 'PANORAMIO';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var lt = d.latitude;
    var ln = d.longitude;
    var m = d.photo_file_url;
    var un = d.owner_id;
    var t = '';
    var n = d.owner_name;
    var p = 'http://static.panoramio.com/avatars/user/' + un + '.jpg?v=000000';
    var l = d.photo_url;
    var unurl = d.owner_url;
    try {
        t = d.photo_title;
    } catch (err) {}
    var fd;
    fd = d.upload_date;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm PM image');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + 'height=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt != '' && ln != '') {
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);
        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;
    }

    addToGrid(buf, suffix);
}

function processDataPICASAWEB(data, suffix) {
    //console.log(data);
    var buf = [];
    var dmn = 'PICASAWEB';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }

    var lt;
    var ln;
    try {
        var loc = d.georss$where.gml$Point.gml$pos.$t;
        var ltln = loc.split(" ");
        lt = ltln[0];
        ln = ltln[1];
    } catch (err) {}
    var m = '';
    try {
        m = d.content.src;
    } catch (err) {}
    var un = d.author[0].gphoto$user.$t;
    var t = '';
    var n = d.author[0].name.$t;
    var p = '';
    try {
        p = d.author[0].gphoto$thumbnail.$t;
    } catch (err) {}
    var l = d.link[1].href;
    var unurl = d.author[0].uri.$t;
    try {
        t = t + d.title.$t;
    } catch (err) {}
    var fd;
    fd = d.updated.$t;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var pos = getShiftedLoc(suffix, lt, ln);
    var marker = new google.maps.Marker({
        position: pos,
        icon: '' + mapicon[dmn]
    });
    window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
    window['bounds_map_' + suffix].extend(pos);
    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm PW image ');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');
    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    marker.meta = {};
    marker.meta.lt = lt;
    marker.meta.ln = ln;
    marker.meta.t = t;
    marker.meta.n = n;
    marker.meta.m = m;
    marker.meta.typ = dmn;
    marker.meta.unurl = unurl;
    marker.meta.p = p;
    marker.meta.l = l;
    marker.meta.d = dstr;
    marker.meta.senti = d.senti;
    marker.meta.suffix = suffix;
    marker.meta.content = ghtml;
    marker.meta.mid = mkrid;
    google.maps.event.addListener(marker, 'mouseover', function() {
        showListPreview(this);
    });
    window['markers_map_' + suffix].push(marker);
    try {
        window['map_' + suffix].addMarker(marker);
    } catch (err) {}
    markersQV[marker.meta.mid] = marker;

    buf.push(ghtml);
    addToGrid(buf, suffix);
}

function processDataPX500(data, suffix) {
    //console.log(data);
    var buf = [];
    var dmn = 'PX500';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var lt = d.latitude;
    var ln = d.longitude;
    var user = d.user;
    var m = d.image_url;
    var un = user.username;
    var t = '';
    var n = user.fullname;
    var p = user.userpic_https_url;
    var l = d.url;
    var unurl = domain[dmn] + un;
    try {
        t = d.description;
    } catch (err) {}
    var fd;
    fd = d.created_at;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var pos = getShiftedLoc(suffix, lt, ln);
    var marker = new google.maps.Marker({
        position: pos,
        icon: '' + mapicon[dmn]
    });
    window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
    window['bounds_map_' + suffix].extend(pos);
    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm PX image');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=https://500px.com' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=https://500px.com');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');
    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    marker.meta = {};
    marker.meta.lt = lt;
    marker.meta.ln = ln;
    marker.meta.t = t;
    marker.meta.n = n;
    marker.meta.m = m;
    marker.meta.typ = dmn;
    marker.meta.unurl = unurl;
    marker.meta.p = p;
    marker.meta.l = l;
    marker.meta.d = dstr;
    marker.meta.senti = d.senti;
    marker.meta.suffix = suffix;
    marker.meta.content = ghtml;
    marker.meta.mid = mkrid;
    google.maps.event.addListener(marker, 'mouseover', function() {
        showListPreview(this);
    });

    window['markers_map_' + suffix].push(marker);
    try {
        window['map_' + suffix].addMarker(marker);
    } catch (err) {}
    markersQV[marker.meta.mid] = marker;

    addToGrid(buf, suffix);

}

function processDataTWITTER(data, suffix) {
    //console.log(data);
    var dmn = 'TWITTER';
    var buf = [];
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var meta;
    try {
        meta = data.meta;
    } catch (err) {}
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
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();
    buf.push('<div class="itm TW ');
    buf.push(senti);
    if (fmedia) {
        for (var q = 0, len2 = fmedia.length; q < len2; q++) {
            buf.push(' ');
            buf.push(fmedia[q].type);
            buf.push(' ');
        }
    }
    buf.push(' " ');
    buf.push(' dt=')
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);
    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-5 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<img class="pull-right m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('<a target=_blank href=');
    buf.push(unurl);
    buf.push(' uid=');
    buf.push(user.id);
    buf.push(' tid=');
    buf.push(d.id_str);
    buf.push(' ts=');
    try {
        buf.push(meta.ts);
    } catch (err) {}
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">@');
    buf.push(un);
    buf.push('</h6>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p>');
    buf.push('<p class="m-l-5"><i class="fa fa-users"></i>');
    buf.push(user.followers_count);
    buf.push(' <i class="fa fa-retweet"></i>');
    buf.push(d.retweet_count);
    buf.push('</p>');
    buf.push('</div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / img_w * img_h + ' />');
    }
    buf.push('<p class="padding-10 f12">');
    buf.push(t);
    buf.push('</p></a>');

    if (!widget) {
        buf.push('<button type="TRUE_TW" class="m-l-5 m-b-5 btn btn-xs btn-complete">TrueId</button> ');
        //buf.push('<button type="E_TW" class="m-b-5 btn btn-xs btn-complete"><i class="fa fa-bullhorn"></i></button> ');
        buf.push('<button class="m-b-5 btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button>');

        try {
            if (meta.faved == 'Y') buf.push(' <span class="badge badge-warning">Favorited</span> ');
        } catch (err) {}
        try {
            if (meta.liked == 'Y') buf.push(' <span class="badge badge-warning">Liked</span> ');
        } catch (err) {}
        try {
            if (meta.commented == 'Y') buf.push(' <span class="badge badge-warning">Replied</span> ');
        } catch (err) {}
        try {
            if (meta.rted == 'Y') buf.push(' <span class="badge badge-warning">ReTweeted</span> ');
        } catch (err) {}
        try {
            if (meta.followed == 'Y') buf.push(' <span class="badge badge-warning">Followed</span> ');
        } catch (err) {}

    }

    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt == '') {
        //console.log('Marker not added' + lt + ':' + ln);
        //console.log(loc);
    } else {
        //console.log('Marker added' + lt + ':' + ln);
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        marker.meta = {};
        var mm = marker.meta;
        mm.lt = lt;
        mm.ln = ln;
        mm.t = t;
        mm.n = n;
        mm.m = m;
        mm.typ = dmn;
        mm.unurl = unurl;
        mm.p = p;
        mm.l = l;
        mm.d = dstr;
        mm.senti = d.senti;
        mm.suffix = suffix;
        mm.content = ghtml;
        mm.mid = mkrid;
        marker.meta = mm;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });
        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;

    }

    addToGrid(buf, suffix);
}

function processDataVK(data, suffix) {
    var buf = [];
    var dmn = 'VK';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var lt = d.lat;
    var ln = d.long;
    var m = d.photo_130;
    var un = d.owner_id;
    var t = '';
    var n = d.owner_id;
    var p = '';
    var l = domain[dmn] + 'photo' + un + '_' + d.id;
    var unurl = domain[dmn] + 'id' + un;
    try {
        t = d.text;
    } catch (err) {}
    var fd;
    fd = d.date * 1000;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var pos = getShiftedLoc(suffix, lt, ln);
    var marker = new google.maps.Marker({
        position: pos,
        icon: '' + mapicon[dmn]
    });
    window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
    window['bounds_map_' + suffix].extend(pos);
    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm VK ');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / d.width * d.height + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    marker.meta = {};
    marker.meta.lt = lt;
    marker.meta.ln = ln;
    marker.meta.t = t;
    marker.meta.n = n;
    marker.meta.m = m;
    marker.meta.typ = dmn;
    marker.meta.unurl = unurl;
    marker.meta.p = p;
    marker.meta.l = l;
    marker.meta.d = dstr;
    marker.meta.senti = d.senti;
    marker.meta.suffix = suffix;
    marker.meta.content = ghtml;
    marker.meta.mid = mkrid;
    google.maps.event.addListener(marker, 'mouseover', function() {
        showListPreview(this);
    });
    window['markers_map_' + suffix].push(marker);
    try {
        window['map_' + suffix].addMarker(marker);
    } catch (err) {}
    markersQV[marker.meta.mid] = marker;

    addToGrid(buf, suffix);

}

function processDataWEIBO(data, suffix) {
    console.log('WEIBO');
    //console.log(data);
    var dmn = 'WEIBO';
    var buf = [];
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
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

    var img_h;
    var img_w;
    var fmedia = '';
    try {
        fmedia = fdatatwitter_entities.media;
        if (fmedia) {
            for (var q = 0, len2 = fmedia.length; q < len2; q++) {
                m = fmedia[q].media_url;
                img_h = fmedia[q].sizes.thumb.h;
                img_w = fmedia[q].sizes.thumb.w;
            }
        }
    } catch (err) {}
    var un = user.id;
    var t = '';
    var n = user.name;
    var p = user.profile_image_url;
    var unurl = domain[dmn] + 'u/' + user.id;
    //var l = unurl + '/status/' + d.id_str;
    var wmid = d.mid;
    var l = domain[dmn] + user.id + '/' + weibomid.encode(wmid);
    try {
        t = d.text;
    } catch (err) {}
    var fd;
    fd = d.created_at;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();
    buf.push('<div class="itm WB ');
    buf.push(senti);
    buf.push('" ');
    buf.push(' dt=')
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' uid=');
    buf.push(user.id);
    buf.push(' tid=');
    buf.push(d.id_str);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">@');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / img_w * img_h + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt == '') {
        //console.log('Marker not added' + lt + ':' + ln);
        //console.log(loc);
    } else {
        //console.log('Marker added' + lt + ':' + ln);
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });
        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;

    }

    addToGrid(buf, suffix);

}

function processDataYELP(data, suffix) {
    //console.log(data);
    var buf = [];
    var dmn = 'YELP';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var location = d.location;
    var coord = location.coordinate;
    var lt = '';
    var ln = '';
    try {
        lt = coord.latitude;
        ln = coord.longitude;
    } catch (err) {}
    var m = d.snippet_image_url;
    var un = d.id;
    var t = '';
    var n = d.name;
    var p = d.image_url;
    var l = d.url;
    var unurl = d.url;
    try {
        t = d.snippet_text;
    } catch (err) {}
    var fd;
    fd = d.menu_date_updated * 1000;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm YP text ');
    buf.push(senti);
    buf.push('" dt=');
    var dtime = dt.getTime();
    if (isNaN(dtime)) dtime = 9999999999999;
    buf.push(dtime);
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' />');
        buf.push('<br /><img width=100%  src=');
        buf.push(d.rating_img_url);
        buf.push(' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt == '') {
        //console.log('Marker not added' + lt + ':' + ln);
    } else {
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;
    }

    addToGrid(buf, suffix);

}

function processDataYOUTUBE(data, suffix) {
    var buf = [];
    var dmn = 'YOUTUBE';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var recordingDetails = d.recordingDetails;
    var loc;
    var lt;
    var ln;

    try {
        loc = recordingDetails.location;
        lt = loc.latitude;
        ln = loc.longitude;
    } catch (err) {}

    var snippet = d.snippet;
    var img_h;
    var img_w;

    var user = d.user;
    var m = snippet.thumbnails.default.url;
    img_h = snippet.thumbnails.default.height;
    img_w = snippet.thumbnails.default.width;

    var un = snippet.channelId;
    var t = '';
    var n = snippet.channelTitle;
    var p = '';
    var l = domain[dmn] + 'watch?v=' + d.id;
    var unurl = domain[dmn] + 'channel/' + un;
    try {
        t = snippet.title + ' <br />' + snippet.description;
    } catch (err) {}
    var fd;
    fd = snippet.publishedAt;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");
    var v = domain[dmn] + '/embed/' + d.id;

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm YT video ');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);

    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + ' height=' + window['IMG_WIDTH_' + suffix] / img_w * img_h + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt == '') {} else {
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);

        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.v = v;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;
    }

    addToGrid(buf, suffix);
}

function processDataYIKYAK(data, suffix) {
    var buf = [];
    var dmn = 'YIKYAK';
    var d;
    if (data.data) {
        d = data.data;
    } else {
        d = data;
    }
    var lt = d.latitude;
    var ln = d.longitude;
    var m = '';
    var un = d.posterID;
    var t = '';
    var n = d.posterID;
    var p = '';
    var l = domain[dmn] + d.messageID;
    var unurl = domain[dmn] + 'user/' + un;
    try {
        t = d.message;
        if (t.indexOf('Hold up you') == 0) return;
    } catch (err) {}
    var fd;
    fd = d.time;
    var dt = new Date(fd);
    dt = new Date(dt.getDate() + ',' + months[dt.getMonth()] + ' ' + dt.getFullYear() + ' ' + dt.getHours() + ':' +
        dt.getMinutes());
    var dstr = dt.toString("MMM dd hh:mm tt");

    var senti = getSenti(dmn, d);
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    var mkrid = getQuickUid();

    buf.push('<div class="itm YY image');
    buf.push(senti);
    buf.push('" dt=');
    buf.push(dt.getTime());
    buf.push(' st=');
    buf.push(sprobneg);
    buf.push(' mid=');
    buf.push(mkrid);
    buf.push('><div class="');
    buf.push(senti);
    buf.push(' p-t-5 p-b-35 text-white"><img class="pull-left img-circle m-l-10 m-t-10 m-r-10" width=40 height=40 src=');
    buf.push(p);
    buf.push(' />');
    buf.push('<div><a class=pull-right target=_blank href=');
    buf.push(unurl);
    buf.push('><img class="m-r-10" width=18 src=');
    buf.push(mapicon[dmn]);
    buf.push(' />');
    buf.push('</a><a target=_blank href=');
    buf.push(unurl);
    buf.push(' >');
    buf.push('<h6 class="text-white bold">');
    buf.push(n);
    buf.push('</h6><h6 class="text-white bold">');
    buf.push(un);
    buf.push('</h6></div>');
    buf.push('</a><p class="m-l-5 m-r-5 pull-right f11">');
    buf.push(dstr);
    buf.push('</p></div><div><a target=_blank href=' + l + ' >');
    if (m && m.length > 1) {
        buf.push('<img  src=' + m + ' width=' + window['IMG_WIDTH_' + suffix] + 'height=' + window['IMG_WIDTH_' + suffix] + ' />');
    }
    buf.push('</a></div><div><a target=_blank href=');
    buf.push(l);
    buf.push('><div class="padding-10"><p class="f12">');
    buf.push(t);
    buf.push('</p></div></a></div>');

    if (!widget) {
        buf.push('<div class=padding-5>');
        buf.push('<button class="btn btn-xs ');
        if (lt != '') {
            buf.push('btn-complete" onclick="loc(');
            buf.push(lt);
            buf.push(',');
            buf.push(ln);
            buf.push(');return false;"');
        } else {
            buf.push('" onclick="nolo();"');
        }
        buf.push('><i class="fa fa-map-marker"></i></button></div>');
    }
    buf.push('</div>');

    var ghtml = buf.join("");
    if (suffix == 'main') {
        var idstr = 'An' + lt + ln + dstr.replace(/\s/g, '');
        addToList('<a id="' + idstr + '" name="' + idstr + '"></a>' + ghtml, suffix);
    }

    if (lt != '' && ln != '') {
        var pos = getShiftedLoc(suffix, lt, ln);
        var marker = new google.maps.Marker({
            position: pos,
            icon: '' + mapicon[dmn]
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);
        marker.meta = {};
        marker.meta.lt = lt;
        marker.meta.ln = ln;
        marker.meta.t = t;
        marker.meta.n = n;
        marker.meta.m = m;
        marker.meta.typ = dmn;
        marker.meta.unurl = unurl;
        marker.meta.p = p;
        marker.meta.l = l;
        marker.meta.d = dstr;
        marker.meta.senti = d.senti;
        marker.meta.suffix = suffix;
        marker.meta.content = ghtml;
        marker.meta.mid = mkrid;
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });

        window['markers_map_' + suffix].push(marker);
        try {
            window['map_' + suffix].addMarker(marker);
        } catch (err) {}
        markersQV[marker.meta.mid] = marker;
    }

    addToGrid(buf, suffix);
}

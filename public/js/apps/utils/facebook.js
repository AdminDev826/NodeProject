function processDataFacebook(data){
    console.log(data);
    var dmn = 'FACEBOOK';
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
            var dstr = dt.toString("MMM dd hh:mm");

            try {
                if (lt == '' && ln == '') {
                    lt = photo.latitude;
                    ln = photo.longitude;
                }
            } catch (err) {}

            var pos = getShiftedLoc(lt, ln);
            var marker = new google.maps.Marker({
                position: pos,
                icon: '' + mapicon[dmn]
            });
            window['markerhash'][lt + ':' + ln] = 'Y';
            window['bounds_map'].extend(pos);
            // var senti = getSenti(dmn, photo);
            var sprobpos = 0;
            var sprobneg = 0;
            var sprobneutral = 0;
            try {
                var sprob = d.senti.probability;
                sprobpos = sprob.pos;
                sprobneg = sprob.neg;
                sprobneutral = sprob.neutral;
            } catch (err) {}
            
            google.maps.event.addListener(marker, 'mouseover', function() {
                showListPreview(this);
            });
        }
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
            icon: '' + mapicon[dmn],
            map: map
        });
        window['markerhash_' + suffix][lt + ':' + ln] = 'Y';
        window['bounds_map_' + suffix].extend(pos);
        // var senti = getSenti(dmn, d);
        var sprobpos = 0;
        var sprobneg = 0;
        var sprobneutral = 0;
        try {
            var sprob = d.senti.probability;
            sprobpos = sprob.pos;
            sprobneg = sprob.neg;
            sprobneutral = sprob.neutral;
        } catch (err) {}
        
        google.maps.event.addListener(marker, 'mouseover', function() {
            showListPreview(this);
        });
    }
}
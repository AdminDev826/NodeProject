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

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getMonitor(mID, callback) {
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

function showMessage(message, style) {
    $("#messageTrigger").data("message", message);
    if (style == "success") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-success");
    } else if (style == "warning") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-warning");
    } else if (style == "danger") {
        $("#messageTrigger").data("icon-class", "toast-just-text toast-danger");
    }
    $("#messageTrigger").click();
}
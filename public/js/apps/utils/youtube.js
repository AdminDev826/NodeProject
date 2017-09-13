function processDataYoutube(data, callback){
    var dmn = 'YOUTUBE';
    var location_info = data.location;   // location
    var latitude = "";              // latitude
    var longitude = "";             // longitude
    if (location_info) {
        latitude  = location_info.latitude;
        longitude = location_info.longitude;
    }

    var thumbnail_image         = data.snippet.thumbnails.default.url;
    var thumbnail_image_width   = data.snippet.thumbnails.default.width;
    var thumbnail_image_height  = data.snippet.thumbnails.default.height;
    var username                = data.snippet.channelId;
    var fullname                = data.snippet.channelTitle;
    var title                   = "";
    var description             = "";
    var link                    = domain[dmn] + "watch?v=" + data.id.videoId;
    var user_url                = domain[dmn] + 'channel/' + username;
    var posted_time             = "";
    var embed_video             = domain[dmn] + "/embed/" + data.id.videoId;
    var sentiment               = getSentiment(data.senti.label);

    try {
        title = data.snippet.title;
        description = data.snippet.description;
        title = title + "<br />" + description;
    } catch (err) {}

    var dt = new Date(data.snippet.publishedAt);
    if (dt.getFullYear == new Date().getFullYear) {
       posted_time = moment(dt).format("dddd, MMMM Do, h:mm a");
    } else {
       posted_time = moment(dt).format("dddd, MMMM Do YYYY, h:mm a");
    }

    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = d.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.neg;
        sprobneutral = sprob.neutral;
    } catch (err) {}
    
    callback(getContentYoutube(dmn, thumbnail_image, link, fullname, username, posted_time, sentiment, description, embed_video));
}

function getContentYoutube(dmn, profile_picture, link, fullname, username, posted_time, sentiment, description, embed_video) {
    var content = "";
    content +=  "<div class='post-item post-youtube' onclick='javascript:window.open(`" + link + "`, `_blank`);'>";
    content +=      "<div class='post-avatar'>";
    content +=          "<span class='avatar avatar-online'>";
    content +=              "<img src='" + profile_picture + "' alt='...'>";
    content +=              "<i></i>";
    content +=          "</span>";
    content +=          "<div class='line'></div>";
    content +=          "<img src='" + contentIcon[dmn] + "' class='icon-content' alt='...'>";
    content +=      "</div>";
    content +=      "<div class='post-description'>";
    content +=          "<div class='post-description-header' style='background-color: " + sentiment + ";'>";
    content +=              "<div class='fullname'>" + fullname + "</div>";                        
    content +=              "<div class='tag'>" + username + "</div>";
    content +=              "<div class='time'><i class='icon md-time' aria-hidden='true'></i>" + posted_time + "</div>";
    content +=          "</div>";
    content +=          "<div class='post-description-body'>";
    content +=              "<div class='description'>" + description + "</div>";
    // content +=              "<iframe class='cover-iframe video' src='" + embed_video + "'?autoplay=0&amp;controls=0&amp;showinfo=0&amp;rel=0&amp;loop=1&amp;modestbranding=1&amp;wmode=transparent&amp;enablejsapi=1&amp;api=1'></iframe>";
    content +=              "<img class='post' src='" + profile_picture + "'>";
    content +=              "<div class='social-button-container'>";
    content +=                  "<i class='icon md-star' aria-hidden='true'></i>";
    content +=                  "<i class='icon md-mail-reply' aria-hidden='true'></i>";
    content +=                  "<i class='icon md-account-box-o' aria-hidden='true'></i>";
    content +=                  "<i class='icon wb-more-horizontal' aria-hidden='true'></i>";
    content +=              "</div>";
    content +=          "</div>";
    content +=      "</div>";
    content +=  "</div>";
    return content;
}
function processDataInstagram(data, callback){
    var dmn = "INSTAGRAM";
    var location_info = data.location;   // location
    var latitude = "";              // latitude
    var longitude = "";             // longitude
    if (location_info) {
        latitude  = location_info.latitude;
        longitude = location_info.longitude;
    }

    var fullname        = data.user.full_name;                  // fullname
    var username        = data.user.username;                   // username
    var profile_picture = data.user.profile_picture;            // profile picture
    var user_url        = domain[dmn] + username;               // instagram user url
    var posted_image    = data.images.standard_resolution.url;  // posted image
    var link            = data.link;                            // instagram post url
    var posted_time     = "";
    var description     = "";
    var sentiment       = getSentiment(data.senti.label);

    try {
        description = data.caption.text;
    } catch (err) {}

    
    var dt = new Date(data.created_time * 1000);
    if (dt.getFullYear == new Date().getFullYear) {
       posted_time = moment(dt).format("dddd, MMMM Do, h:mm a");
    } else {
       posted_time = moment(dt).format("dddd, MMMM Do YYYY, h:mm a");
    }
    
    var sprobpos = 0;
    var sprobneg = 0;
    var sprobneutral = 0;
    try {
        var sprob = data.senti.probability;
        sprobpos = sprob.pos;
        sprobneg = sprob.ne
        sprobneutral = sprob.neutral;
    } catch (err) {}

    callback(getContentInstagram(dmn, profile_picture, link, fullname, username, posted_time, sentiment, description, posted_image));
}

function getContentInstagram(dmn, profile_picture, link, fullname, username, posted_time, sentiment, description, posted_image) {
    var content = "";
    content +=  "<div class='post-item post-instagram' onclick='javascript:window.open(`" + link + "`, `_blank`);'>";
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
    content +=              "<img class='post' src='" + posted_image + "'>";
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
function processDataVk(data, callback) {
    var dmn = "VK";
    var latitude        = data.lat;
    var longitude       = data.long;
    var fullname        = data.owner_id;
    var username        = data.owner_id;
    var description     = data.text;
    var profile_picture = data.photo_130;
    var posted_image    = data.photo_604;
    var link            = domain[dmn] + "photo" + username + "_" + data.id;
    var user_url        = domain[dmn] + "id" + username;
    var sentiment       = getSentiment(data.senti.label);

    var dt = new Date(data.date * 1000);
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

    callback(getContentVk(dmn, profile_picture, link, fullname, username, posted_time, sentiment, description, posted_image));
}

function getContentVk(dmn, profile_picture, link, fullname, username, posted_time, sentiment, description, posted_image) {
    var content = "";
    content +=  "<div class='post-item post-vk' onclick='javascript:window.open(`" + link + "`, `_blank`);'>";
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
    content +=              "<img class='post' src='" + posted_image + "'>"
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
function processData(post, callback){
    if (post.ch == "TW") {
        // processDataTwitter(post.feed);
    } else if (post.ch == "IN") {
        // processDataInstagram(post.feed, function(content){
        //     callback(content);
        // });
    } else if (post.ch == "FB") {
        // processDataFacebook(post.feed);
    } else if (post.ch == "YT") {
        processDataYoutube(post.feed, function(content){
            callback(content);
        });
    } else if (post.ch == "4S") {
        // processDataFoursquare(post.feed);
    } else if (post.ch == "VK") {
        // processDataVk(post.feed, function(content){
        //     callback(content);
        // });
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
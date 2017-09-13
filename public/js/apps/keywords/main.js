window.onload = function(){
    initComponent();
    initEventHandler();
}

function initComponent(){
    initToolbarComponent(); 
    initSaveComponent();
    initMainComponent();
}

function initEventHandler(){
    initToolbarEventHandler();
    initMainEventHandler();
}

function initMainComponent(){
    var mID = getParameterByName("mID");
    mID = "DV03VGS4"; 
    if (mID) {
        loadData(mID);
    } else {
        createLiveMonitor(function(success, mID){
            if (!success) return;
            startLiveMonitor(mID);
        });
    }
}

function initMainEventHandler(){
}

function loadData(mID) {
    $.ajax({
        url     : "/apps/keywords/getData",
        data    : {mID: mID},
        type    : "POST",
        success : (res) => {
            if (!res.success) return;
            for (var i=0; i<res.data.posts.length; i++) {
                processData(res.data.posts[i], function(content){
                    if ($(".page-list-view").find(".social-feed-no-data").length > 0) {
                        $(".page-list-view").find(".social-feed-no-data").remove();
                    }
                    $(".page-list-view").append(content);
                });
            }
        } 
    });
}

function createLiveMonitor(callback){
    $.ajax({
        url: "/apps/keywords/createLiveMonitor",
        data: {keywords: getKeywords()},
        type: "POST",
        success: (res) => {
            if (!res.success) {
                callback(false, null);
            } else {
                callback(true, res.data.mid);
            }
        }
    });
}

function startLiveMonitor(mID){
    var host = location.hostname;
    var port = "4848";
    // var wss = new WebSocket("wss://" + host + ":" + port + "/api/v1/monitor/live?mid=" + mID);
    var wss = new WebSocket("ws://" + host + ":" + port + "/api/v1/monitor/live?mid=" + mID);
    wss.onopen = function(evt){
        console.log("onopen");
    }
    wss.onerror = function(evt){
    }
    wss.onmessage = function(evt){
        console.log("onmessage");
        var data = JSON.parse(evt.data);
        
        processData(data, function(content){
            if ($(".page-list-view").find(".social-feed-no-data").length > 0) {
                $(".page-list-view").find(".social-feed-no-data").remove();
            }
            $(".page-list-view").append(content);
        });
    }
}

function getMonitor(mID, callback){
    $.ajax({
        url     : "/apps/keywords/getMonitor",
        method  : "POST",
        data    : {mID: mID},
        success : (res) => {
            if (!res.data) return;
            callback(res.data);
        }
    });
}

function getKeywords() {
    return $("#mKeywords").val();
}
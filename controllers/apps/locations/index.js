var express         = require("express");
var async           = require('async');
var router          = express.Router();
var Response        = require("../../../helpers/response");
var Request         = require("../../../helpers/request");
var AccountHelper   = require('../../../helpers/account');
var UserHelper      = require('../../../helpers/user');
var PlanHelper      = require('../../../helpers/plan');
var AppHelper       = require('../../../helpers/app');
var MonitorHelper   = require('../../../helpers/monitor'); 

router.get("/", (req, res, next) => {
    Response.render(res, "apps/locations/index");
});

router.post("/saveMonitor", (req, res, next) => { 
    var email           = req.cookies.email; 
    var name            = req.body.name;
    var timezone        = req.body.timezone;
    var locations       = req.body.locations;
    var currentDataType = req.body.currentDataType;
    var keywords        = req.body.keywords;
    var ttUsernames     = req.body.ttUsernames;
    var igUsernames     = req.body.igUsernames;
    var mID             = req.body.mID;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account); 
            });
        },
        (account, done) => {
            PlanHelper.getPlanById(account.plan_id, (err, plan) => {
                done(err, account, plan);
            });
        },
        (account, plan, done) => {
            AppHelper.getAppByURL("/apps/locations", (err, app) => {
                done(err, account, plan, app);
            });
        },
        (account, plan, app, done) => {
            if (plan.max_monitors == account.monitors.length) {
                Response.send(res, {success: false, message: "The count of Max monitor reached. Please upgrade your plan."});
            } else {
                var data = {
                    "name"      : name,
                    "email"     : email,
                    "locations" : locations,
                    "twitter"   : ttUsernames,
                    "instagram" : igUsernames,
                    "timezone"  : timezone,
                    "mid"       : mID,
                    "appid"     : app.id
                };
                Request.post("/monitor/edit", data, function(err, response, body) {
                    if (err) {
                        Response.send(res, {success: false, message: err});
                    } else {
                        done(null, account, plan, body);   
                    }
                });
            }
        },
        (account, plan, data, done) => {
            account.monitors.push(data.mid);
            account.save((err) => {
                Response.send(res, {success: true});
            });
        }
    ]);
});

router.post("/createLiveMonitor", (req, res, next) => {
    Request.post("/monitor/edit", {
        "locations" : req.body.locations,
        "keywords" : "black hat",
        "live" : true
    }, function(err, response, body) {
        if (err) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true, data: body, err: err, response: response});
        }
    });
});

//get monitor
router.post("/getMonitor", (req, res, next) => {    
    var email       = req.cookies.email;
    var mID         = req.body.mID;
    var appID       = req.body.appID;

    if (mID) {
        MonitorHelper.getMonitorByMonitorId(mID, (err, monitor) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                if (monitor.status != "D") {
                    Response.send(res, {success: true, data: monitor});
                } else {
                    Response.send(res, {success: false});
                }
            }
        });
    } else if (appID) {
        MonitorHelper.getMonitorByAppId(appID, (err, monitors) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                var response = [];
                for (var i=0; i<monitors.length; i++) {
                    if (monitors[i].status != "D") {
                        response.push(monitors[i]);
                    }
                }
                Response.send(res, {success: true, data: response});
            }
        });
    } else {
        MonitorHelper.getMonitorByEmail(email, (err, monitors) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                var response = [];
                for (var i=0; i<monitors.length; i++) {
                    if (monitors[i].status != "D") {
                        response.push(monitors[i]);
                    }
                }
                Response.send(res, {success: true, data: response});    
            }
        });
    }
});

// get saved monitor data
router.post("/getData", (req, res, next) => {
    var mID     = req.body.mID;
    Request.post("/monitor/saved", {"mid" : mID}, function(err, response, body) {
        if (err) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true, data: body});
        }
    });
});

// delete monitor data
router.post("/deleteData", (req, res, next) => {
    var mID      = req.body.mID;
    var from     = req.body.from;
    var to       = req.body.to;

    Request.post("/monitor/delete", {"mid" : mID, "from": from, "to" : to}, function(err, response, body) {
        if (err != null || body.status != 0) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true});
        }
    });
});

//pause monitor
router.post("/pauseMonitor", (req, res, next) => {
    var mID     = req.body.mID;
    Request.post("/monitor/pause", {"mid" : mID}, function(err, response, body) {
        if (err != null || body.status != 0) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true});
        }
    });
});
//resume monitor
router.post("/resumeMonitor", (req, res, next) => {
    var mID     = req.body.mID;
    Request.post("/monitor/resume", {"mid" : mID}, function(err, response, body) {
        if (err != null || body.status != 0) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true});
        }
    });
});

//set default location
router.post("/setDefaultLocation", (req, res, next) => {
    var defaultLocation = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        zoom: req.body.zoom
    };

    UserHelper.setDefaultLocation(req.cookies.user_id, defaultLocation, (err, success) => {
        if (err) {
            Response.send(res, {success: false});
        } else {
            Response.send(res, {success: true});
        }
    });
});
//get default location
router.post("/getDefaultLocation", (req, res, next) => {
    UserHelper.getDefaultLocation(req.cookies.user_id, (err, defaultLocation) => {
        Response.send(res, {success: true, defaultLocation: defaultLocation});
    });
});

module.exports = router;
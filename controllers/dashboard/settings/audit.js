var express     = require('express');
var async       = require('async');
var CryptoJS    = require('crypto-js');
var router      = express.Router();
var moment      = require('moment-timezone');
var Response    = require('../../../helpers/response'); 

AccountHelper   = require('../../../helpers/account');
AuditHelper     = require('../../../helpers/audit');
UserHelper      = require('../../../helpers/user');
Event           = require('../../../models/event');

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/audit/index');
});

router.post('/', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    var userID              = req.cookies.user_id;
    var email               = req.cookies.email;
    var role                = req.cookies.user_type;
    var loadIndex           = req.body.loadIndex;
    var searchActor         = req.body.actor;
    var searchTimeFrom      = req.body.time_from;
    var searchTimeTo        = req.body.time_to;
    var searchEvent         = req.body.event;
    var searchDescription   = req.body.description;
    var encryptedData       = req.body.encryptedData;

    if (encryptedData != null && encryptedData != undefined && encryptedData != "") {
        email = getDecryptedData(encryptedData);
    }

    if (encryptedData == "audit_internal_encrypted_data_welink") {
        AuditHelper.getAuditByUserId(null, null, loadIndex, searchTimeFrom, searchTimeTo, searchEvent, searchDescription, (err, result) => {
            var data = [];
            sendData(0, res, result, data, searchActor);
        });  
    } else {
        async.waterfall([
            (done) => {
                UserHelper.getUserByEmail(email, (err, user) => {
                    if (user != null && user.length > 0) {
                        userID  = user._id; 
                        role    = user.user_type;
                        done(err);
                    } else {
                        Response.send(res, {data: []});
                    }
                });
            },
            (done) => {
                AccountHelper.getAccountByEmail(email, (err, account) => {
                    done(err, account);
                });
            }, 
            (account, done) => {
                if (role != 2) {
                    AuditHelper.getAuditByUserId(account.id, null, loadIndex, searchTimeFrom, searchTimeTo, searchEvent, searchDescription, (err, result) => {
                        var data = [];
                        sendData(0, res, result, data, searchActor);
                    });    
                } else {
                    AuditHelper.getAuditByUserId(account.id, userID, loadIndex, searchTimeFrom, searchTimeTo, searchEvent, searchDescription, (err, result) => {
                        var data = [];
                        sendData(0, res, result, data, searchActor);
                    });  
                }
            }
        ]);
    }
});

sendData = (i, res, result, data, searchActor) => {
    if (i < result.length) {
        UserHelper.getUserById(result[i].user_id, (err, user) => {
            var item = [];

            if (user == null) {
                sendData(i + 1, res, result, data, searchActor);    
            } else {
                item.push(user.fullname);
                item.push(moment(result[i].date).format('YYYY-MM-DD HH:mm'));
                item.push(Event.getEventById(result[i].event).event);
                item.push(Event.getEventById(result[i].event).description + result[i].target);

                if (searchActor != null) {
                    if (user.fullname.startsWith(searchActor)) {
                        data.push(item);
                    }
                } else {
                    data.push(item);
                }

                sendData(i + 1, res, result, data, searchActor);
            }
        });
    } else {
        Response.send(res, {data: data});
    }
}

router.post('/getUsers', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    var email           = req.cookies.email;
    var encryptedData   = req.body.encryptedData;

    if (encryptedData != null && encryptedData != undefined && encryptedData != "") {
        email = getDecryptedData(encryptedData);
    }

    if (encryptedData == "audit_internal_encrypted_data_welink") {
        email = null;
    }
    
    AccountHelper.getAllUsersByOwnerEmail(email, (err, users) => {
        var data = [];
        for (var i = 0; i < users.length; i++) {
            data.push(users[i].fullname);
        }
        Response.send(res, {data: data});
    });
});

router.post('/getEvents', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    var data = [];

    for (var i = 0; i < Event.getAllEvents().length; i++) {
        data.push(Event.getAllEvents()[i].event);
    }
    
    Response.send(res, {data: data});
});

getDecryptedData = (encryptedData) => {
    return CryptoJS.AES.decrypt(encryptedData, "encrypt_secret_key_welink").toString(CryptoJS.enc.Utf8);
}

module.exports = router;
var async           = require('async');

Audit               = require('../models/audit');
Event               = require('../models/event');
AccountHelper       = require('./account'); 
SocketHelper        = require('./socket');

AuditHelper = () => {
}

/**
    @param: 
        auditInfo:      audit object
    @description:
        Save audit information.
*/
AuditHelper.save = (auditInfo) => {

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(auditInfo.email, (err, account) => {
                done(err, account);
            });
        },

        (account, done) => {
            var audit = new Audit({
                account_id:     account.id,
                user_id:        auditInfo.user_id,
                event:          auditInfo.event,
                date:           new Date(),
                target:         auditInfo.target,
            });

            audit.save((err) => {
                SocketHelper.send(
                    auditInfo.response, 
                    {
                        user_id: auditInfo.user_id, 
                        event:   Event.getEventById(auditInfo.event).event, 
                        description: Event.getEventById(auditInfo.event).description + auditInfo.target
                    }
                );
            });
        }
    ]);
}

/**
    @param: 
        callback:   callback function (err, audit_ary)
    @description:
        Get audit by user id. If userID is null, return all audit informations.
*/
AuditHelper.getAuditByUserId = (accountID, userID, loadIndex, sTimeFrom, sTimeTo, sEvent, sDescription, callback) => {
    var query = {};

    if (accountID != null) {
        query.account_id = accountID;
    }

    if (userID != null) {
        query.user_id = userID;
    }

    if (loadIndex == null) {
        loadIndex = 0;
    }

    if (sTimeFrom != null && sTimeTo != null) {
        query.date = {$gt: new Date(sTimeFrom), $lt: new Date(sTimeTo)};
    } else {
        if (sTimeFrom != null) {
            query.date = {$gt: new Date(sTimeFrom)};
        }

        if (sTimeTo != null) {
            query.date = {$lt: new Date(sTimeTo)};
        }
    }

    if (sEvent != null) {
        if (Event.getEventByType(sEvent)) {
            query.event = Event.getEventByType(sEvent).id;
        } else {
            query.event = null;
        }
    }

    if (sDescription != null) {
        if (Event.getEventsByDescription(sDescription)) {
            query.event = {$in: Event.getEventsByDescription(sDescription)};
        } else {
            query.event = null;
        }
    }

    Audit.find(query)
         .sort({'date': -1})
         .exec((err, auditAry) => {
             callback(err, auditAry.slice(loadIndex * 12, loadIndex * 12 + 12));
         });  
}

module.exports = AuditHelper;
/**
    * Created by kdees912 on 02/14/2017
    * Helper for Group Model
*/

var async           = require('async');
var AccountHelper   = require('./account');
Group               = require('../models/group');
User                = require('../models/user');

GroupHelper = () => {

}

/**
    @param: 
        groupID: group id
        callback : callback function
    @description:
        Get group info by group id 
*/
GroupHelper.getGroupById = (groupID, callback) => {
    Group.findById(groupID, (err, group) => {
        if (err) {
            callback(err);
        } else {
            callback(null, group);
        }
    });
}

/**
    @param: 
        groupID: group id
        callback : (err, users)
    @description:
        Get users info by group id
*/

GroupHelper.getUsersByGroupId = (groupID, callback) => {
    async.waterfall([
        (done) => {
            Group.findById(groupID, (err, group) => {
                if (err) {
                    done(err);
                } else {
                    done(null, group);
                }
            });
        },

        (group, done) => {
            User.find({_id: {$in: group.users}}, (err, users) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, users);
                }
            })
        }
    ]);
}

/**
    @param:
        email: owner email 
        groupName: group name
        callback : callback function (err)
    @description:
        Create group by owner eamil
*/
GroupHelper.createGroupByOwnerEmail = (email, groupName, callback) => {
    AccountHelper.getAccountByEmail(email, (err, account) => {
        if (err) {
            callback(err);
        } else {
            var group = new Group({
                "account_id":   account.id,
                "name":         groupName,
            });
            group.save((err) => {
                if (err) {
                    callback(err);
                } else {
                    account.groups.push(group.id);
                    account.save((err) => {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, group);
                        }
                    });
                }
            });
        }
    });
}

/**
    @param:
        email: owner email 
        groupID: group id
        callback : callback function (err, success)
    @description:
        Delete group by owner eamil
*/
GroupHelper.deleteGroupByOwnerEmail = (email, groupID, callback) => {
    AccountHelper.getAccountByEmail(email, (err, account) => {
        if (err) {
            callback(err, false);
        } else {
            Group.findById(groupID).remove((err) => {
                if (err) {
                    callback(err, false);
                } else {
                    if (account.groups.indexOf(groupID) > -1) {
                        account.groups.splice(account.groups.indexOf(groupID), 1);
                        account.save((err) => {
                            if (err) {
                                callback(err, false);
                            } else {
                                callback(null, true);
                            }
                        });
                    }
                }
            })
        }
    });
}

/**
    @param:
        groupID:    group id 
        userID:     member id
        callback : callback function (err, success)
            err: if error occured, else return error null
            success: if succeed true otherwise false
    @description:
        Create group by owner eamil
*/
GroupHelper.addMemberToGroup = (groupID, userID, callback) => {
    Group.findById(groupID, (err, group) => {
        group.users.push(userID);
        group.save((err) => {
            if (err) {
                callback(err);
            } else {
                callback(null, true);
            }
        });
    })
}

/**
    @param:
        groupID:    group id 
        callback : callback function (err, success)
            err: if error occured, else return error null
            success: if succeed true otherwise false
    @description:
        Remove all members from group
*/
GroupHelper.removeAllMembersFromGroup = (groupID, callback) => {
    Group.findById(groupID, (err, group) => {
        group.users = [];
        group.save((err) => {
            if (err) {
                callback(err);
            } else {
                callback(null, true);
            }
        });
    });
}



module.exports = GroupHelper;


var express         = require('express');
var router          = express.Router();
var async           = require('async');
var Response        = require('../../../helpers/response');
var Account         = require('../../../models/account'); 
var User            = require('../../../models/user'); 
var Group           = require('../../../models/group'); 
var UserHelper      = require('../../../helpers/user');
var AccountHelper   = require('../../../helpers/account'); 
var GroupHelper     = require('../../../helpers/group');
var PlanHelper      = require('../../../helpers/plan');
var MailHelper      = require('../../../helpers/mail');
var AuditHelper     = require('../../../helpers/audit');
var Event           = require('../../../models/event'); 

router.get('/', (req, res, next) => {
    var email       = req.cookies.email;
    var userType    = req.cookies.user_type;
    var userID      = req.cookies.user_id;
    
    async.waterfall([
        (done) => {
            AccountHelper.getAllUsersByOwnerEmail(email, (err, members) => {
                if (err) {
                    Response.send(res, {result: 1}); 
                } else {
                    done(null, members);
                }
            });
        },

        (members, done) => {
            AccountHelper.getGroupWithUsers(email, (err, groups) => {
                if (err) {
                    Response.send(res, {result: 1});
                } else {
                    done(null, members, groups);
                }
            });
        },

        (members, groups, done) => {
            
            AccountHelper.getUsersByOwnerEmail(email, (err, users) => {
                if (err) {
                    Response.send(res, {result: 1});
                } else {
                    done(null, members, groups, users);
                }
            });

        },

        (members, groups, users, done) => {
            
            AccountHelper.getAdminsByOwnerEmail(email, (err, admins) => {
                if (err) {
                    Response.send(res, {result: 1});
                } else {
                    res.render('dashboard/settings/index', {active_menu: "team", members: members, groups: groups,
                                users: users, admins: admins, userType: userType, userID: userID});
                }
            });

        }
    ]);
});

router.post('/inviteMember', (req, res, next) => {
    var ownerEmail      = req.cookies.email;

    var memberEmail     = req.body.email;
    var firstName       = req.body.firstName; 
    var lastName        = req.body.lastName;
    var userType        = req.body.userType;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('InviteMember').id,
        target: memberEmail,
        response: res});

    async.waterfall([
        (done) => {
            AccountHelper.isAvailableToInvite(ownerEmail, memberEmail, (err, available) => {
                if (err) {
                    Response.send(res, {result: 1, message: err});
                } else {
                    done(null, available);
                }
            });
        },

        (available, done) => {
            if (available == 1) {
                async.waterfall([
                    (next) => {
                        AccountHelper.getAccountByEmail(memberEmail, (err, account) => {
                            if (err) {
                                Response.send(res, {result: 1, message: err});
                            } else {
                                next(null, account);
                            }
                        });
                    },

                    (prevAccount, next) => {
                        User.findOne({email: memberEmail}, (err, user) => {
                            if (err) {
                                Response.send(res, {result:1, message:err});
                            } else {
                                next(null, user, prevAccount);
                            }
                        });
                    },

                    (user, prevAccount, next) => {
                        AccountHelper.getAccountByEmail(ownerEmail, (err, account) => {
                            if (err) {
                                Response.send(res, {result:1, message:err});
                            } else {
                                account.users.push(user.id);
                                account.save((err) => {
                                    if (err) {
                                        Response.send(res, {result: 1, message: err});
                                    } else {
                                        user.account_id = account.id;
                                        user.prev_account_id = prevAccount.id;
                                        user.user_type  = userType;

                                        user.save((err) => {
                                            if (err) {
                                                Response.send(res, {result: 1, message: err});
                                            } else {
                                                Response.send(res, {result:0, message: "Success"});
                                            }
                                        });
                                    }
                                });   
                            }
                        });
                    }
                ]);
            } else if (available == 2) {
                async.waterfall([
                    (next) => {
                        AccountHelper.inviteMember(ownerEmail, memberEmail, firstName, lastName, userType, (err, resetToken, user) => {
                            if (err) {
                                Response.send(res, {result: 1, message: err});
                            } else {
                                next(null, resetToken, user);
                            }
                        });
                    },

                    (resetToken, user, next) => {
                        var link = 'http://' + req.headers.host + '/dashboard/account/reset/' + resetToken;
                        MailHelper.sendInviteMail(memberEmail, firstName, lastName, link, (err, success) => {
                            if (err) {
                                Response.send(res, {result: 1, message: "Error occured while sending mail"});
                            } else {
                                next(null, user);
                            }
                        });
                    }, 

                    (user, next) => {
                        AccountHelper.getAccountByEmail(ownerEmail, (err, account) => {
                            if (err) {
                                Response.send(res, {result: 1, message: "Error occured while sending mail"});
                            } else {
                                Group.findOne({account_id: account._id, name: "No Groups"}, (err, group) => {
                                    group.users.push(user.id);
                                    group.save((err) => {
                                        // if (!err) Response.send(res, {result: 0, message: "We sent invitation email."});
                                        Response.send(res, {result: 0, message: "Success"});
                                    });
                                });
                            }
                        });
                    }

                ]);
                
            }
        },        
    ]);
    
});

router.post('/getUsers', (req, res, next) => {
    var email = req.cookies.email;

    AccountHelper.getUsersByOwnerEmail(email, (err, users) => {
        if (err) {
            Response.send(res, {result: 1});
        } else {
            Response.send(res, {result: 0, users: users});
        }
    });

});

router.post('/createGroup', (req, res, next) => {
    var email       = req.cookies.email;
    var groupName   = req.body.groupName;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('CreateGroup').id,
        target: groupName,
        response: res});

    GroupHelper.createGroupByOwnerEmail(email, groupName, (err, group) => {
        
        if (err) {
            Response.send(res, {result: 1, message: "Error occured while creating group."});
        } else {
            Response.send(res, {result: 0, group_id: group.id, message: "Group created successfully."});
        }
    });
});

router.post('/assignMembersToGroup', (req, res, next) => {
    var email       = req.cookies.email;
    var groupID     = req.body.groupID;
    var userIDs     = JSON.parse(req.body.userIDs);

    console.log("UserIDs", userIDs);
    
    GroupHelper.getGroupById(groupID, (err, group) => {
        if (err) {
            Response.send(res, {result: 1, message: "Error occured while adding member to group."});
        } else {
            group.users = userIDs;
            group.save((err) => {
                if (err) {
                    Response.send(res, {result: 1, message: "Error occured while adding member to group."});
                } else {
                    UserHelper.getUsersByIds(userIDs, (err, users) => {
                        var target = group.name + " (";

                        if (users.length == 0) {
                            target = "removed all members";
                        } else {
                            for (var i = 0; i < users.length; i++) {
                                if (i == users.length - 1) {
                                    target += users[i].email + ")";
                                } else {
                                    target += users[i].email + ", ";
                                }
                            }
                        }

                        AuditHelper.save({
                            email: req.cookies.email, 
                            user_id: req.cookies.user_id, 
                            event: Event.getEventByType('AssignMembersToGroup').id,
                            target: target,
                            response: res});
                    });
                    Response.send(res, {result: 0, message: "Added member to group successfully."});
                }
            });
            
        }
    });
});

router.post('/deleteGroup', (req, res, next) => {
    var email   = req.cookies.email;
    var groupID = req.body.groupID;

    GroupHelper.getGroupById(groupID, (err, group) => {
        AuditHelper.save({
            email: req.cookies.email, 
            user_id: req.cookies.user_id, 
            event: Event.getEventByType('DeleteGroup').id,
            target: group.name,
            response: res});
    });

    GroupHelper.deleteGroupByOwnerEmail(email, groupID, (err, success) => {
        if (success) {
            Response.send(res, {result: 0});
        } else {
            Response.send(res, {result: 1, message: err});
        }
    });
});

router.post('/setUserType', (req, res, next) => {
    var userID          = req.body.name;
    var userTypeValue   = req.body.value;

    var target = "";
    if (userTypeValue == 0) {
        target = "Owner";
    } else if (userTypeValue == 1) {
        target = "Admin";
    } else if (userTypeValue == 2) {
        target = "Member";
    } 

    UserHelper.getUserById(userID, (err, user) => {
        if (err) {
            Response.send(res, [{value: ""}]);
        } else {
            user.user_type = userTypeValue;
            user.save((err) => {
                if (err) {
                    Response.send(res, [{value: ""}]);
                } else {
                    AuditHelper.save({
                        email: req.cookies.email, 
                        user_id: req.cookies.user_id, 
                        event: Event.getEventByType('SetUserType').id,
                        target: user.email + " to " + target,
                        response: res});
                    Response.send(res, [{value: userTypeValue}]);
                }
            });
        }
    })
});

router.post('/getEditableDataSource', (req, res, next) => {
    var userType = req.cookies.user_type;
    var data_source;

    if (userType == 0) {
        data_source = [{
            value: 0,
            text: 'Owner',
        }, {
            value: 1,
            text: 'Admin',
        }, {
            value: 2,
            text: 'Member',
        }];

        Response.send(res, {result: 0, data_source: data_source});
    } else if (userType == 1) {
        data_source = [{
            value: 1,
            text: 'Admin',
        }, {
            value: 2,
            text: 'Member',
        }];

        Response.send(res, {result: 0, data_source: data_source});
    }
});

router.post('/checkGroupNameAvailable', (req, res, result) => {
    var email       = req.cookies.email;
    var groupName   = req.body.groupName; 

    AccountHelper.getGroupWithUsers(email, (err, groups) => { 
        var flag = true;
        for (var i = 0; i < groups.length; i++) {
            if (groupName == groups[i].name) {
                flag = false;
            }
        }

        if (flag)
            Response.send(res, {result: 0, message: null});
        else 
            Response.send(res, {result: 2, message: 'Group name is already taken. Please choose another name.'});
    })
});

router.post('/getUsersByGroupId', (req, res, next) => {
    var groupID = req.body.groupID;
    
    GroupHelper.getUsersByGroupId(groupID, (err, users) => {
        if (err) {
            Response.send(res, {result: 1, message: err});
        } else {
            Response.send(res, {result: 0, users: users});
        }
    });
});

router.post('/deactivateMember', (req, res, next) => {
    var userID = req.body.userID;

    UserHelper.deactivate(userID, (err, success) => {
        if (err) {
            Response.send(res, {result: 1, message: err});
        } else {
            UserHelper.getUserById(userID, (err, user) => {
                AuditHelper.save({
                    email: req.cookies.email, 
                    user_id: req.cookies.user_id, 
                    event: Event.getEventByType('DeactivateMember').id,
                    target: user.email,
                    response: res});
            });

            Response.send(res, {result: 0});
        }
    });
});

router.post('/activateMember', (req, res, next) => {
    var userID = req.body.userID;

    UserHelper.activate(userID, (err, success) => {
        if (err) {
            Response.send(res, {result: 1, message: err});
        } else {
            UserHelper.getUserById(userID, (err, user) => {
                AuditHelper.save({
                    email: req.cookies.email, 
                    user_id: req.cookies.user_id, 
                    event: Event.getEventByType('ActivateMember').id,
                    target: user.email,
                    response: res});
            });

            Response.send(res, {result: 0});
        }
    });
});

router.post('/deleteMember', (req, res, next) => {
    var userID = req.body.userID;
    var email  = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (err) {
                    Response.send(res, {result: 1, message: err});
                } else {
                    done(null, account);
                }
            });
        },

        (account, done) => {
            async.waterfall([
                (next) => {
                    if (account.users.indexOf(userID) > -1) {
                        account.users.splice(account.users.indexOf(userID), 1);
                        account.save((err) => {
                            next();
                        });
                    } else {
                        Response.send(res, {result:2, message: 'Error occured on database'});
                    }
                }, 

                (next) => {
                    User.findById(userID, (err, user) => {
                        if (user.prev_account_id == null) {
                            User.findById(userID).remove((err) => {
                                if (err) {
                                    Response.send(res, {result: 1, message: err});
                                } else {
                                    Response.send(res, {result: 0, message: 'Deleted user from account successfully'});
                                }
                            });
                        } else {
                            user.account_id = user.prev_account_id;
                            user.user_type = 0;
                            user.prev_account_id = null;

                            user.save((err) => {
                                if (err) {
                                    Response.send(res, {result: 1, message: err});
                                } else {
                                    next();
                                }
                            });
                        }
                    });

                    AuditHelper.save({
                        email: req.cookies.email, 
                        user_id: req.cookies.user_id, 
                        event: Event.getEventByType('DeleteMember').id,
                        target: user.email,
                        response: res});
                },

                (next) => {
                    Group.find({users: userID}, (err, groups) => {
                        if (err) {
                            Response.send(res, {result: 1, message: err});
                        } else {
                            deleteMemberfromGroup(0, groups, userID, res);
                        }
                    });
                }
            ]);
        }
    ]); 
});

deleteMemberfromGroup = (i, groups, userID, res) => {
    if (i < groups.length) {
        groups[i].users.splice(groups[i].users.indexOf(userID), 1);
        groups[i].save((err) => {
            if (err) {
                Response.send(res, {result: 1, message: err});
            } else{
                deleteMemberfromGroup(i+1, groups, userID, res);
            }
        });
    } else {
        Response.send(res, {result: 0, message: 'Deleted user from account successfully'});
    }
}

module.exports = router;
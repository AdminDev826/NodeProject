/**
    * Created by kdees912 on 02/14/2017
    * Helper for Account Model
*/

var async       = require('async');
var PlanHelper  = require('./plan');
var UserHelper  = require('./user');
User            = require('../models/user');
Account         = require('../models/account');
Group           = require('../models/group');
Plan            = require('../models/plan');

AccountHelper = () => {
}

/**
    @param: 
        accountID: account id
        callback : callback function
    @description:
        Get account info by account id
*/
AccountHelper.getAccountById = (accountID, callback) => {
    Account.findById(accountID, (err, account) => {
        if (err) {
            callback(err);
        } else {
            callback(null, account);
        }
    })
}

/** 
    @param: 
        email: owner email address
        callback : callback function
    @description:
        Get account info by email
*/
AccountHelper.getAccountByEmail = (email, callback) => {
    async.waterfall([
        (done) => {
            User.findOne({email: email}, (err, user) => {
                if (err) {
                    done(err);
                } else {
                    done(err, user);
                }
            })
        },

        (user, done) => {
            if (user == null) {
                callback('account is not existing.', null);
            } else {
                Account.findById(user.account_id, (err, account) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, account);
                    }
                });
            }
        },
    ], (err) => {
        if (err) callback(err);
    });
}

/** 
    @param: 
        email: owner email address
        callback : callback function (err, members)
    @description:
        Get user infos by owner email (User Object Array, including pending members)
        if email is null, return all users.
*/
AccountHelper.getAllUsersByOwnerEmail = (email, callback) => {
    if (email == null) {
        User.find({}, (err, users) => {
            callback(err, users);
        });
    } else {
        async.waterfall([
            (done) => {
                User.findOne({email: email}, (err, user) => {
                    if (err) {
                        done(err);
                    } else {
                        done(err, user);
                    }
                })
            },

            (user, done) => {
                Account.findById(user.account_id, (err, account) => {
                    if (err) {
                        done(err);
                    } else {
                        done(err, account);
                    }
                });
            },

            (account, done) => {
                User.find({ _id: {$in: account.users}}).sort('status').exec((err, users) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, users);
                    }
                });
            },
        ], (err) => {
            if (err) callback(err);
        });
    }
}

/** 
    @param: 
        ownerEmail:     owner email address
        callback :      callback function (err, users)
    @description:
        Get all users info by ownerEmail (excluding pending members)
*/
AccountHelper.getUsersByOwnerEmail = (email, callback) => {
    async.waterfall([
        (done) => {
            User.findOne({email: email}, (err, user) => {
                if (err) {
                    done(err);
                } else {
                    done(err, user);
                }
            })
        },

        (user, done) => {
            Account.findById(user.account_id, (err, account) => {
                if (err) {
                    done(err);
                } else {
                    done(err, account);
                }
            });
        },

        (account, done) => {
            User.find({ _id: {$in: account.users}, status: {$ne: 1}}, (err, users) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, users);
                }
            });
        },
    ]);
}

/** 
    @param: 
        ownerEmail:     owner email address
        callback :      callback function (err, admins)
    @description:
        Get all admins info by ownerEmail (excluding pending admins)
*/
AccountHelper.getAdminsByOwnerEmail = (email, callback) => {
    async.waterfall([
        (done) => {
            User.findOne({email: email}, (err, user) => {
                if (err) {
                    done(err);
                } else {
                    done(err, user);
                }
            })
        },

        (user, done) => {
            Account.findById(user.account_id, (err, account) => {
                if (err) {
                    done(err);
                } else {
                    done(err, account);
                }
            });
        },

        (account, done) => {
            User.find({ _id: {$in: account.users}, status: {$ne: 1}, user_type: {$lt: 2}}).sort('status').exec((err, users) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, users);
                }
            });
        },
    ]);
}

/** 
    @param: 
        email: owner email address
        callback : callback function (err, groups)
    @description:
        Get groups with users
*/
AccountHelper.getGroupWithUsers = (email, callback) => {
    async.waterfall([
        (done) => {
            User.findOne({email: email}, (err, user) => {
                if (err) {
                    done(err);
                } else {
                    done(err, user);
                }
            })
        },

        (user, done) => {
            Account.findById(user.account_id, (err, account) => {
                if (err) {
                    done(err);
                } else {
                    done(err, account);
                }
            });
        },

        (account, done) => {
            Group.find({_id: {"$in": account.groups}}, (err, groups) => {
                if (err) {
                    done(err);
                } else {
                    done(null, groups);
                }
            });
        },

        (groups, done) => {
            var ret = [];
            repeaterForGroupWithUsers(0, groups, ret, callback);
        }
    ]);
}

repeaterForGroupWithUsers = (i, groups, ret, callback) => {
    if (i < groups.length) {
        var element = {};
        element['id']           = groups[i]._id;
        element['name']         = groups[i].name;
        element['account_id']   = groups[i].account_id;
        element['monitors']     = groups[i].monitors;
        element['users'] = [];
        User.find({_id: {"$in": groups[i].users}}, (err, users) => {
            if (err) {
                callback(err);
            } else {
                for (var j = 0; j < users.length; j++) {
                    var user_info = {};
                    user_info['_id']        = users[j]._id;
                    user_info['fullname']   = users[j].fullname;
                    user_info['email']      = users[j].email;
                    user_info['user_type']  = users[j].user_type;
                    user_info['status']     = users[j].status;

                    element['users'].push(user_info);
                }
            }

            ret.push(element);

            repeaterForGroupWithUsers(i+1, groups, ret, callback);
        }); 
    } else {
        callback(null, ret);
    }
}

/** 
    @param: 
        ownerEmail:     owner email address
        memberEmail:    member email address
        firstName:      member's first name
        LastName:       member's last name
        userType:       user type (admin, member)
        callback :      callback function (err, resetToken, user)
    @description:
        invite member to account
*/
AccountHelper.inviteMember = (ownerEmail, memberEmail, firstName, lastName, userType, callback) => {
    UserHelper.saveInviteMember(memberEmail, firstName, lastName, userType, (err, user, resetToken) => {
        if (err) {
            callback(err);
        } else {
             module.exports.getAccountByEmail(ownerEmail, (err, account) => {
                 if (err) {
                     callback(err);
                 } else {
                     account.users.push(user.id);
                     account.save((err) => {
                        if (err) {
                            callback(err);
                        } else {
                            user.account_id = account._id;
                            user.save();
                            callback(null, resetToken, user);
                            
                        }
                     });
                     
                 }
             });
        }
    });
}

/** 
    @param: 
        ownerEmail:     owner email address
        memberEmail:    member email address
        callback :      callback function (err, available) available// 0: not available, 1: already registered, 2: not registered
    @description:
        invite member to account
*/

AccountHelper.isAvailableToInvite = (ownerEmail, memberEmail, callback) => {
    
    async.waterfall([
        (done) => {
            User.findOne({email: memberEmail}, (err, user) => { 
                if (err) {
                    callback(err, 0);
                } else {
                    if (user != null) {
                        // callback("This email already registered.", false);
                        async.waterfall([
                            (next) => {
                                module.exports.getAccountByEmail(ownerEmail, (err, currentAccount) => {
                                    if (currentAccount.id == user.account_id) {
                                        callback("This user has already joined in this account.", 0);
                                    } else {
                                        next();
                                    }
                                });
                            },

                            (next) => {
                                module.exports.getAccountByEmail(user.email, (err, account) => {
                                    
                                    if (account.owner_id != user.id) {
                                        callback("This user has already joined in another account.", 0);
                                    } else {
                                        if (account.users.length > 1) {
                                            callback("This user already has active account that contains multiple users.", 0);
                                        } else {
                                            done(null, 1);
                                        }
                                    }
                                });
                            }
                        ]);
                    } else {
                        done(null, 2);
                    }
                }
            })
        },

        (available, done) => {
            module.exports.getPlanByEmail(ownerEmail, (err, plan) => {
                if (err) {
                    callback(err);
                } else {
                    module.exports.getAccountByEmail(ownerEmail, (err, account) => {
                        if (err) {
                            callback(err);
                        } else {
                            if (account.users.length < plan.max_users) {
                                callback(null, available);
                            } else {
                                callback("The number of users reached at max users.", 0);
                            }
                        }
                    });
                }
            });
        },
    ]);
}

/**
    @param: 
        email: owner/admin email
        callback: callback function 
    @description:
        Get Plan Info by admin/owner email
*/
AccountHelper.getPlanByEmail = (email, callback) => { 
    async.waterfall([
        (done) => {
            User.findOne({email: email},(err, user) => {
                if (err) {
                    done(err);
                } else {
                    done(err, user);    
                }
            });
        },

        (user, done) => {
            Account.findById(user.account_id, (err, account) => {
                if (err) {
                    done(err);
                } else {
                    done(err, account);
                }
            });
        }, 

        (account, done) => {
            Plan.findById(account.plan_id, (err, plan) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, plan);
                }
            });
        },
    ], (err) => {
        if (err) {
            console.log('setting-plan.js controller', err);    
        }
    }); 
};

module.exports = AccountHelper;


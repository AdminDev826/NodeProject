/**
    * Created by kdees912 on 02/14/2017
    * Helper for User Model
*/

var async       = require('async');
var crypto      = require('crypto');
User            = require('../models/user'); 

UserHelper = () => {

}

/**
    @param: 
        userID: user id
        callback : callback function
    @description:
        Get user info by user id
*/
UserHelper.getUserById = (userID, callback) => {
    User.findById(userID, (err, user) => {
        if (err) {
            callback(err);
        } else {
            callback(null, user) 
        }
    });
}

/**
    @param: 
        email: user email
        callback : callback function
    @description:
        Get user info by user email
*/
UserHelper.getUserByEmail = (email, callback) => {
    User.find({email: email}, (err, user) => {
        if (err) {
            callback(err);
        } else {
            callback(null, user) 
        }
    });
}

/**
    @param: 
        userIDs:    user id array
        callback :  callback function (err, users)
    @description:
        Get users info by user ids
*/
UserHelper.getUsersByIds = (userIDs, callback) => {
    User.find({_id: {$in: userIDs}}, (err, users) => {
        if (err) {
            callback(err);
        } else {
            callback(null, users)
        }
    });
}

/**
    @param: 
        email:      email
        firstName:  first name
        lastName:   last name
        userType:   user type (admin, member)
        callback :  callback function (err, user, resetToken)
    @description:
        Save invited member
*/
UserHelper.saveInviteMember = (email, firstName, lastName, userType, callback) => {
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            var user = new User({
                "fullname":             firstName + " " + lastName,
                "email":                email,
                "user_type":            userType,
                "resetPasswordToken":   token,
                "resetPasswordExpires": Date.now() + 3600000,
                "status":               1,
            });

            user.save((err) => {
                callback(err, user, token);
            });
        },
    ]);

}

/**
    @param: 
        userID :    user id
        callback :  callback function (err, success)
    @description:
        Deactivate member
*/
UserHelper.deactivate = (userID, callback) => {
    User.findById(userID, (err, user) => {
        if (err) {
            callback(err, false);
        } else {
            user.status = 2;
            user.save((err) => {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });
        }
    });
}

/**
    @param: 
        userID :    user id
        callback :  callback function (err, success)
    @description:
        Activate member
*/
UserHelper.activate = (userID, callback) => {
    User.findById(userID, (err, user) => {
        if (err) {
            callback(err, false);
        } else {
            user.status = 0;
            user.save((err) => {
                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });
        }
    });
}

/**
 * @param:
 *      userID, defaultLocation{latitude, longitude, zoom}
 * @description: 
 *      set default location
 * @return:
 *      return success(bool)
 */
UserHelper.setDefaultLocation = (userID, defaultLocation, callback) => {
    User.findById(userID, (err, user) => {
        if (err) {
            callback(err, false);
        } else {
            user.default_location = defaultLocation;
            user.save((err)=>{
                if (err) {
                    callback(err, false);
                } else {
                    callback(err, true);
                }
            });
        }
    });
}
/**
 * @param:
 *      userID
 * @description: 
 *      get default location
 * @return:
 *      return default location{latitude, longitude, zoom}
 */
UserHelper.getDefaultLocation = (userID, callback) => {
    User.findById(userID, (err, user) => {
        callback(err, user.default_location);
    });
}

module.exports = UserHelper;


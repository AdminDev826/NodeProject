/**
 * @author: kdees912
 * @created: 04/07/2017
 * @modified: 04/17/2017
 * @description: Helper for App Model
*/
App = require('../models/app');

AppHelper = () => {
}

/**
 *@param: 
        appID: app id
        callback : callback function (err, app)
 *@description:
        Get app info by app id
*/
AppHelper.getAppById = (appID, callback) => {
    App.findById(appID, (err, app) => {
        callback(err, app);
    });
}

/**
 *@param: 
        app_url: app url
        callback : callback function (err, app)
 *@description:
        Get app info by app url
*/
AppHelper.getAppByURL = (app_url, callback) => {
    App.findOne({app_url: app_url}, (err, app) => {
        callback(err, app);
    });
}

/**
    @param: 
        app: app object
        callback : callback function (err, app, success)
    @description:
        Save app
*/
AppHelper.save = (app, callback) => {
    var obj = new App(app);
    
    obj.save((err, app) => {
        if (err) {
            callback(err, null, false);
        } else {
            callback(err, app, true);
        }
    })
}

/**
    @param:
        appID: app id 
        data: data
        callback : callback function (err, success)
    @description:
        Update app by id
*/
AppHelper.updateAppById = (appID, data, callback) => {
    App.findByIdAndUpdate(appID, data, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
}

/**
    @param:
        accountID: account id 
        callback : callback function (err, apps)
    @description:
        Get apps by account id
*/
AppHelper.getAppByAccountId = (accountID, callback) => {
    App.find({created_by: accountID}, (err, apps) => {
        callback(err, apps);
    });
}

/**
    @param:
        access: access (0: system provided, 1: public, 2: private)
        callback : callback function (err, apps)
    @description:
        Get apps by access
        if access is null, return all apps
*/
AppHelper.getAppByAccess = (access, callback) => {
    App.find({access: access}, (err, apps) => {
        callback(err, apps);
    });
}

/**
    @param:
        appID: app id
        callback : callback function (err, success)
    @description:
        remove app by id
*/
AppHelper.deleteAppById = (appID, callback) => {
    App.findByIdAndRemove(appID, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
}

AppHelper.getAppByQuery = (query, callback) => {
    App.find(query).sort({access: 'asc'}).exec((err, apps) => {
        callback(err, apps);
    });
}

module.exports = AppHelper;
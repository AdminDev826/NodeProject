/**
    * Created by kdees912 on 07/08/2017
    * Helper for Monitor Model
*/
var async       = require('async');
Monitor         = require('../models/monitor');

MonitorHelper   = () => {
}

/**
 * @param: 
 *      mID: monitor id
 * @return:
 *      monitor
 * @description:
 *      Get monitor by monitor id
 */
MonitorHelper.getMonitorByMonitorId = (mID, callback) => {
    Monitor.findOne({_id: mID}, (err, monitor) => {
        callback(err, monitor);
    });
}

/**
 * @param: 
 *      appID: app id
 * @return:
 *      monitors
 * @description:
 *      Get monitors by app id
 */
MonitorHelper.getMonitorByAppId = (appID, callback) => {
    Monitor.find({appid: appID}, (err, monitors) => {
        callback(err, monitors);
    });
}

/**
 * @param: 
 *      email: user's email
 * @return:
 *      Array of monitors
 * @description:
 *      Get monitors by user's email
 */
MonitorHelper.getMonitorByEmail = (email, callback) => {
    Monitor.find({email: email}, (err, monitors) => {
        callback(err, monitors);
    });
}

module.exports = MonitorHelper;
/**
 * @author: kdees912
 * @created: 04/17/2017
 * @modified: 05/05/2017
 * @description: Helper for Plugin Model
*/
Plugin = require('../models/plugin');

PluginHelper = () => {
}

/**
 *@param: 
        pluginID: plugin id
        callback : callback function (err, plugin)
 *@description:
        Get plugin info by plugin id
*/
PluginHelper.getPluginById = (pluginID, callback) => {
    Plugin.findById(pluginID, (err, plugin) => {
        callback(err, plugin);
    });
}

/**
    @param: 
        plugin: plugin object
        callback : callback function (err, plugin, success)
    @description:
        Save plugin
*/
PluginHelper.save = (plugin, callback) => {
    var obj = new Plugin(plugin);
    
    obj.save((err, plugin) => {
        if (err) {
            callback(err, null, false);
        } else {
            callback(err, plugin, true);
        }
    })
}

/**
    @param:
        pluginID: plugin id 
        data: data
        callback : callback function (err, success)
    @description:
        Update plugin by id
*/
PluginHelper.updatePluginById = (pluginID, data, callback) => {
    Plugin.findByIdAndUpdate(pluginID, data, (err) => {
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
        callback : callback function (err, plugins)
    @description:
        Get plugins by account id
*/
PluginHelper.getPluginByAccountId = (accountID, callback) => {
    Plugin.find({created_by: accountID}, (err, plugins) => {
        callback(err, plugins);
    });
}

/**
    @param:
        access: access (0: system provided, 1: public, 2: private)
        callback : callback function (err, plugins)
    @description:
        Get plugins by access
        if access is null, return all plugins
*/
PluginHelper.getPluginByAccess = (access, callback) => {
    Plugin.find({access: access}, (err, plugins) => {
        callback(err, plugins);
    });
}

/**
    @param:
        pluginID: plugin id
        callback : callback function (err, success)
    @description:
        remove plugin by id
*/
PluginHelper.deletePluginById = (pluginID, callback) => {
    Plugin.findByIdAndRemove(pluginID, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
}

PluginHelper.getPluginByQuery = (query, callback) => {
    Plugin.find(query).sort({access: "asc"}).exec((err, plugins) => {
        callback(err, plugins);
    });
}

module.exports = PluginHelper;
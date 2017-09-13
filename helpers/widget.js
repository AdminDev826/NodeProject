/**
    * Created by kdees912 on 04/17/2017
    * Helper for Widget Model
*/
Widget = require('../models/widget');

WidgetHelper = () => {
}

/**
    @param:
        widgetID: widget id
        callback : callback function (err, widget)
    @description:
        Get widget info by widget id
*/
WidgetHelper.getWidgetById = (widgetID, callback) => {
    Widget.findById(widgetID, (err, widget) => {
        callback(err, widget);
    });
}

module.exports = WidgetHelper;
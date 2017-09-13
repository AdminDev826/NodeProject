/**
    * Created by kdees912 on 02/14/2017
    * Helper for Plan Model
*/

var async       = require('async');

Plan            = require('../models/plan');

PlanHelper = () => {

}

/**
    @param: 
        planID: plan id
        callback: callback function (err, plan)
    @description:
        Get plan by id. If planID is null, return all plans.
*/
PlanHelper.getPlanById = (planID, callback) => {
    if (planID != null) {
        Plan.findById(planID, (err, plan) => {
            callback(err, plan);
        });
    } else {
        Plan.find({}, (err, plans) => {
            callback(err, plans);
        });
    }
    
}

/**
    @param: 
        planType: plan type
        callback: callback function (err, plan) 
    @description:
        Get plan by type. 
*/
PlanHelper.getPlanByType = (planType, callback) => {
    Plan.findOne({plan_type: planType}, (err, plan) => {
        callback(err, plan);
    });
}

/**
    @param: 
        planID: plan object
        callback: callback function (err, success)
    @description:
        Add new plan 
*/
PlanHelper.setPlan = (plan, callback) => {
    plan.save((err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    })
}

module.exports = PlanHelper;
var mongoose = require('mongoose');
var async    = require('async');
var Schema   = mongoose.Schema;

var planSchema = new Schema({
    name:                       {type: String, "default": "defaultPlan"},
    max_users:                  {type: Number, "default": 3},
    max_posts:                  {type: Number, "default": 3},
    max_storage:                {type: Number, "default": 2048},
    max_monitors:               {type: Number, "default": 3},
    max_live_searches:          {type: Number, "default": 3},
    max_live_searches_per_user: {type: Number, "default": 3},
    max_monitors_per_user:      {type: Number, "default": 3},
    api_limit_day:              {type: Number, "default": 10},
    api_limit_month:            {type: Number, "default": 300},
    cost_monthly:               {type: Number},
    cost_yearly:                {type: Number},
    discount:                   {type: Number},
    plan_type:                  {type: Number}, //0: Trial, 1: Bronze, 2: Silver, 3: Golden, 4: Enterprise
});

module.exports = mongoose.model('Plan', planSchema);
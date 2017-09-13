var express         = require('express');
var router          = express.Router();
var async           = require('async');
var Response        = require('../../../helpers/response');

AccountHelper       = require('../../../helpers/account');
UserHelper          = require('../../../helpers/user');
AppHelper           = require('../../../helpers/app');

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/apps/index');
});

router.get('/create', (req, res, next) => {
    res.render('dashboard/settings/apps/create');
});

router.post('/create', (req, res, next) => {
    var email   = req.cookies.email;
    var userID  = req.cookies.user_id;
    
    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },
        (account,done) => {
            UserHelper.getUserById(userID, (err, user) => {
                done(err, account, user);
            });
        },
        (account, user, done) => {
            AppHelper.save({
                name            : req.body.name,
                created_at      : new Date(),
                author          : user.fullname,
                author_email    : email,
                created_by      : account.id,
                description     : req.body.description,
                access          : req.body.access,
                properties      : JSON.parse(req.body.properties),
                app_url         : req.body.app_url,
                tags            : req.body.tags,
                images          : JSON.parse(req.body.images),
                license_type    : req.body.license_type,
                license_method  : req.body.license_method,
                license_cost    : req.body.license_cost,
                num_install     : 0
            }, (err, app, success) => {
                if (success) {
                    done(err, account, app);
                } else {
                    Response.send(res, {success: false});   
                }
            });
        },

        (account, app, done) => {
            account.apps.push(String(app._id));
            account.save((err) => {
                Response.send(res, {success: true});
            }); 
        }
    ]);
});

router.get('/edit', (req, res, next) => {
    res.render('dashboard/settings/apps/edit');
});

router.post('/edit', (req, res, next) => {
    var appID = req.body.appID;
    
    AppHelper.updateAppById(appID, {
        name                : req.body.name,
        updated_at          : new Date(),
        description         : req.body.description,
        access              : req.body.access,
        properties          : JSON.parse(req.body.properties),
        app_url             : req.body.app_url,
        tags                : req.body.tags,
        license_type        : req.body.license_type,
        license_method      : req.body.license_method,
        license_cost        : req.body.license_cost,
        images              : JSON.parse(req.body.images),
    }, (err, success) => {
        Response.send(res, {success: success});
    });
});

router.post('/delete', (req, res, next) => {
    var appID = req.body.appID;
    AppHelper.deleteAppById(appID, (err, sucess) => {
        Response.send(res, {success: true});
    });
});

router.post('/add', (req, res, next) => {
    var appID   = req.body.appID;
    var email   = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.apps.indexOf(appID) > -1) {
                    Response.send(res, {success: true});
                } else {
                    account.apps.push(appID);
                    account.save((err) => {
                        if (err) {
                            Response.send(res, {success: false});
                        } else {
                            done(err);
                        }
                    });
                }
            });
        },

        (done) => {
            AppHelper.getAppById(appID, (err, app) => {
                app.num_install ++;
                app.save((err) => {
                    if (err) {
                        Response.send(res, {success: false});
                    } else {
                        Response.send(res, {success: true});
                    }
                });
            });
        }
    ]);
});

router.post('/remove', (req, res, next) => {
    var appID   = req.body.appID;
    var email   = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.apps.indexOf(appID) < 0) {
                    Response.send(res, {success: false});
                } else {
                    account.apps.splice(account.apps.indexOf(appID), 1);
                    account.save((err) => {
                        if (err) {
                            Response.send(res, {success: false});
                        } else {
                            done(err);
                        }
                    });
                }
            });
        },

        (done) => {
            AppHelper.getAppById(appID, (err, app) => {
                app.num_install --;
                if (app.num_install < 0) app.num_install = 0;
                
                app.save((err) => {
                    if (err) {
                        Response.send(res, {success: false});
                    } else {
                        Response.send(res, {success: true});
                    }
                });    
            });
        }
    ]);
});

router.post('/rate', (req, res, next) => {
    var appID   = req.body.appID;
    var rating  = req.body.rating;

    AppHelper.getAppById(appID, (err, app) => {
        app.ratings.push(rating);
        app.save((err, app) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                var sum_ratings = 0;
                for (var i=0; i<app.ratings.length; i++) {
                    sum_ratings += Number(app.ratings[i]);
                }
                Response.send(res, {success: true, average_rating: sum_ratings/app.ratings.length});
            }
        })
    });
});

router.post('/getAccountApps', (req, res, next) => { 
    var email           = req.cookies.email;
    var appID           = req.body.appID;

    if (appID) {
        AppHelper.getAppById(appID, (err, app) => {
            if (app) {
                Response.send(res, {
                    success: true,
                    app: app
                });
            } else {
                Response.send(res, {
                    success: false,
                    app: app
                });
            }
        });
    } else {
        async.waterfall([
            (done) => {
                AccountHelper.getAccountByEmail(email, (err, account) => {
                    done(err, account);
                });
            },
            (account, done) => {
                AppHelper.getAppByQuery({$or: [{_id: {$in: account.apps}}, {access: 0}]}, (err, apps) => {
                    var data = [];
                    for (var i=0; i<apps.length; i++) {
                        var item = {};

                        item._id            = apps[i]._id;
                        item.name           = apps[i].name;
                        item.author         = apps[i].author;
                        item.description    = apps[i].description;
                        item.app_url        = apps[i].app_url;
                        item.num_install    = apps[i].num_install;
                        item.ratings        = apps[i].ratings;
                        item.access         = apps[i].access;
                        item.properties     = apps[i].properties;

                        if (String(account._id) == String(apps[i].created_by)) {
                            item.isOwner    = true;
                        } else {
                            item.isOwner    = false;
                        }
                        data.push(item);
                    }
                    
                    Response.send(res, {
                        success : true,
                        apps    : data
                    });
                });
            }
        ]);
    }
});

router.post('/getPublicApps', (req, res, next) => {
    var email       = req.cookies.email;
    var loadIndex   = req.body.loadIndex;
    var searchWord  = req.body.searchWord;
    var columns     = ["icon", "title", "ratings", "num_install", "author", "id"];

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },

        (account, done) => {
            AppHelper.getAppByAccess({$in: [1]}, (err, apps) => {
                var array_one = [];

                for (var i=0; i<apps.length; i++) {
                    if (account.apps.indexOf(String(apps[i]._id)) < 0) {
                        array_one.push(apps[i]);
                    }
                }

                var array_two = [];
                if (searchWord != null && searchWord != '' && searchWord != undefined) {
                    for (var i=0; i<array_one.length; i++) {
                        if (array_one[i].name.toLowerCase().indexOf(searchWord.toLowerCase()) > -1 ||
                            array_one[i].description.toLowerCase().indexOf(searchWord.toLowerCase()) > -1 ||
                            array_one[i].tags.toLowerCase().indexOf(searchWord.toLowerCase()) > -1) {
                                array_two.push(array_one[i]);
                        }
                    }
                } else {
                    array_two = array_one;
                }

                var data = [];
                for (var i=0; i<array_two.length; i++) {
                    var item = [];
                    for (var j=0; j<columns.length; j++) {
                        if (columns[j] == "icon") {
                            item.push("icon");
                        } else if (columns[j] == "title") {
                            var obj = {};
                            obj.name           = array_two[i]["name"]; 
                            obj.description    = array_two[i]["description"]; 
                            obj.app_url        = array_two[i]["app_url"]; 
                            item.push(obj);
                        } else if (columns[j] == "ratings") {
                            item.push(array_two[i]["ratings"]);
                        } else if (columns[j] == "num_install") {
                            item.push(String(array_two[i]["num_install"]));
                        } else if (columns[j] == "author") {
                            item.push(array_two[i]["author"]);
                        } else if (columns[j] == "id") {
                            item.push(array_two[i]["_id"]);
                        } 
                    }

                    data.push(item);
                }

                if (loadIndex < 0) loadIndex = 0;
                Response.send(res, {data: data.slice(loadIndex*9, loadIndex * 9 + 8)});
            });
        }
    ]);
});

module.exports = router;
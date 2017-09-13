var express         = require('express');
var router          = express.Router();
var async           = require('async');
var Response        = require('../../../helpers/response');

AccountHelper       = require('../../../helpers/account'); 
UserHelper          = require('../../../helpers/user');
PluginHelper        = require('../../../helpers/plugin'); 

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/plugins/index');
});

router.get('/create', (req, res, next) => {
    res.render('dashboard/settings/plugins/create');
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
            PluginHelper.save({
                name            : req.body.name,
                created_at      : new Date(),
                author          : user.fullname,
                author_email    : email,
                created_by      : account.id,
                description     : req.body.description,
                access          : req.body.access,
                properties      : JSON.parse(req.body.properties),
                plugin_url      : req.body.plugin_url,
                tags            : req.body.tags,
                images          : JSON.parse(req.body.images),
                license_type    : req.body.license_type,
                license_method  : req.body.license_method,
                license_cost    : req.body.license_cost,
                num_install     : 0
            }, (err, plugin, success) => {
                if (success) {
                    done(err, account, plugin);
                } else {
                    Response.send(res, {success: false});
                }
            });
        },
        (account, plugin, done) => {
            account.plugins.push(String(plugin._id));
            account.save((err) => {
                Response.send(res, {success: true});
            });
        }
    ]);
});

router.get('/edit', (req, res, next) => {
    res.render('dashboard/settings/plugins/edit');
});

router.post('/edit', (req, res, next) => {
    var pluginID = req.body.pluginID;
    
    PluginHelper.updatePluginById(pluginID, {
        name                : req.body.name,
        updated_at          : new Date(),
        description         : req.body.description,
        access              : req.body.access,
        properties          : JSON.parse(req.body.properties),
        plugin_url          : req.body.plugin_url,
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
    var pluginID = req.body.pluginID;

    PluginHelper.deletePluginById(pluginID, (err, sucess) => {
        Response.send(res, {success: true});
    });
});

router.post('/add', (req, res, next) => {
    var pluginID    = req.body.pluginID;
    var email       = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.plugins.indexOf(pluginID) > -1) {
                    Response.send(res, {success: true});
                } else {
                    account.plugins.push(pluginID);
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
            PluginHelper.getPluginById(pluginID, (err, plugin) => {
                plugin.num_install ++;
                plugin.save((err) => {
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
    var pluginID   = req.body.pluginID;
    var email      = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.plugins.indexOf(pluginID) < 0) {
                    Response.send(res, {success: false});
                } else {
                    account.plugins.splice(account.plugins.indexOf(pluginID), 1);
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
            PluginHelper.getPluginById(pluginID, (err, plugin) => {
                plugin.num_install --;
                if (plugin.num_install < 0) plugin.num_install = 0;

                plugin.save((err) => {
                    if (err) {
                        Response.send(res, {success: false});
                    } else {
                        Response.send(res, {success: true});
                    }
                });    
            })
        }
    ]);
});

router.post('/rate', (req, res, next) => {
    var pluginID    = req.body.pluginID;
    var rating      = req.body.rating;

    PluginHelper.getPluginById(pluginID, (err, plugin) => {
        plugin.ratings.push(rating);
        plugin.save((err, plugin) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                var sum_ratings = 0;
                for (var i=0; i<plugin.ratings.length; i++) {
                    sum_ratings += Number(plugin.ratings[i]);
                }
                Response.send(res, {success: true, average_rating: sum_ratings/plugin.ratings.length});
            }
        })
    });
});

router.post('/getAccountPlugins', (req, res, next) => {
    var email           = req.cookies.email;
    var pluginID        = req.body.pluginID;

    if (pluginID) {
        PluginHelper.getPluginById(pluginID, (err, plugin) => {
            if (plugin) {
                Response.send(res, {
                    success: true,
                    plugin: plugin
                });
            } else {
                Response.send(res, {
                    success: false,
                    plugin: plugin
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
                PluginHelper.getPluginByQuery({$or: [{_id: {$in: account.plugins}}, {access: 0}]}, (err, plugins) => {
                    var data = [];
                    for (var i=0; i<plugins.length; i++) {
                        var item = {};

                        item._id            = plugins[i]._id;
                        item.name           = plugins[i].name;
                        item.author         = plugins[i].author;
                        item.description    = plugins[i].description;
                        item.plugin_url     = plugins[i].plugin_url;
                        item.tags           = plugins[i].tags;
                        item.images         = plugins[i].images;
                        item.num_install    = plugins[i].num_install;
                        item.ratings        = plugins[i].ratings;
                        item.access         = plugins[i].access;

                        if (String(account._id) == String(plugins[i].created_by)) {
                            item.isOwner    = true;
                        } else {
                            item.isOwner    = false;
                        }
                        data.push(item);
                    }
                    Response.send(res, {
                        success : true,
                        plugins : data
                    });
                });
            }
        ]);
    }
});

router.post('/getPublicPlugins', (req, res, next) => {
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
            PluginHelper.getPluginByAccess({$in: [1]}, (err, plugins) => {
                var array_one = [];

                for (var i=0; i<plugins.length; i++) {
                    if (account.plugins.indexOf(String(plugins[i]._id)) < 0) {
                        array_one.push(plugins[i]);
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
                            obj.plugin_url     = array_two[i]["plugin_url"];
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
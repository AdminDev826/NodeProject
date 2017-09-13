var express         = require('express');
var router          = express.Router();
var async           = require('async');
var Response        = require('../../../helpers/response');

AccountHelper       = require('../../../helpers/account');
UserHelper          = require('../../../helpers/user');
DictionaryHelper    = require('../../../helpers/dictionary'); 

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/dictionaries/index');
});

router.get('/create', (req, res, next) => {
    res.render('dashboard/settings/dictionaries/create');
});

router.get('/edit', (req, res, next) => {
    res.render('dashboard/settings/dictionaries/edit');
});

router.post('/addDictionary', (req, res, next) => {
    var dictionaryID    = req.body.dictionaryID;
    var email           = req.cookies.email;
    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.dictionaries.indexOf(dictionaryID) > -1) {
                    Response.send(res, {success: true});
                } else {
                    account.dictionaries.push(dictionaryID);
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
            DictionaryHelper.getDictionaryById(dictionaryID, (err, dictionary) => {
                dictionary.num_install ++;
                dictionary.save((err) => {
                    if (err) {
                        Response.send(res, {success: false});
                    } else {
                        Response.send(res, {success: true});
                    }
                })
            })
        }
    ]);
});

router.post('/removeDictionary', (req, res, next) => {
    var dictionaryID    = req.body.dictionaryID;
    var email           = req.cookies.email;
    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                if (account.dictionaries.indexOf(dictionaryID) < 0) {
                    Response.send(res, {success: false});
                } else {
                    account.dictionaries.splice(account.dictionaries.indexOf(dictionaryID), 1);
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
            DictionaryHelper.getDictionaryById(dictionaryID, (err, dictionary) => {
                dictionary.num_install --;
                if (dictionary.num_install < 0) dictionary.num_install = 0;
                
                dictionary.save((err) => {
                    if (err) {
                        Response.send(res, {success: false});
                    } else {
                        Response.send(res, {success: true});
                    }
                })
            })
        }
    ]);
});

router.post('/rateDictionary', (req, res, next) => {
    var dictionaryID    = req.body.dictionaryID;
    var rating          = req.body.rating;

    DictionaryHelper.getDictionaryById(dictionaryID, (err, dictionary) => {
        dictionary.ratings.push(rating);
        dictionary.save((err, dic) => {
            if (err) {
                Response.send(res, {success: false});
            } else {
                var sum_ratings;
                for (var i=0; i<dic.ratings.length; i++) {
                    sum_ratings += Number(dic.ratings[i]);
                }
                Response.send(res, {success: true, average_rating: sum_ratings/dic.ratings.length});
            }
        });
    });
});

router.post('/getPublicDictionaries', (req, res, next) => {
    var email       = req.cookies.email;
    var loadIndex   = req.body.loadIndex;
    var search_word = req.body.search_word;
    var aColumns    = ["icon", "title", "items", "ratings", "num_install", "author", "id"];

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },
        (account, done) => {
            DictionaryHelper.getDictionaryByAccess({$in: [1]}, (err, dictionaries) => {
                var result = [];

                for (var i=0; i<dictionaries.length; i++) {
                    if (account.dictionaries.indexOf(String(dictionaries[i]._id)) < 0) {
                        result.push(dictionaries[i]);
                    }
                }

                var res_dictionaries = [];
                
                if (search_word != null && search_word != ''&& search_word != undefined) {
                    for (var i=0; i<result.length; i++) {
                        if (result[i].name.toLowerCase().indexOf(search_word.toLowerCase()) > -1 || 
                            result[i].description.toLowerCase().indexOf(search_word.toLowerCase()) > -1 || 
                            result[i].keywords.toLowerCase().indexOf(search_word.toLowerCase()) > -1 ||
                            result[i].tags.toLowerCase().indexOf(search_word.toLowerCase()) > -1) {

                            res_dictionaries.push(result[i]);

                        }
                    }
                } else {
                    res_dictionaries = result;
                }

                var resp = [];

                for (var i = 0; i < res_dictionaries.length; i++) {
                    var row = [];
                    for (var j = 0; j < aColumns.length; j++) {
                        if (aColumns[j] == 'icon') {
                            row.push("icon");
                        } else if (aColumns[j] == 'title') {
                            var data = {};
                            data.name           = res_dictionaries[i]["name"];
                            data.description    = res_dictionaries[i]["description"];
                            data.doc_link       = res_dictionaries[i]["doc_link"];
                            row.push(data);
                        } else if (aColumns[j] == 'items') {
                            var data = {};
                            data.keywords = res_dictionaries[i]["keywords"].split(',').length;
                            data.images   = res_dictionaries[i]["images"].length;
                            row.push(data);
                        } else if (aColumns[j] == 'ratings') {
                            row.push(res_dictionaries[i]["ratings"]);
                        } else if (aColumns[j] == 'num_install') {
                            row.push(res_dictionaries[i]["num_install"].toString());
                        } else if (aColumns[j] == 'author') {
                            row.push(res_dictionaries[i]["author"]);
                        } else if (aColumns[j] == 'id') {
                            row.push(res_dictionaries[i]["_id"]);
                        }
                    }

                    resp.push(row);
                }

                if (loadIndex < 0) loadIndex = 0;

                Response.send(res, {data: resp.slice(loadIndex * 9, loadIndex * 9 + 8)});
            });
        }
    ]);
});

router.post('/getAccountDictionaries', (req, res, next) => {
    var email           = req.cookies.email;
    var dictionaryID    = req.body.dictionaryID;

    if (dictionaryID) {
        DictionaryHelper.getDictionaryById(dictionaryID, (err, dictionary) => {
            if (dictionary) {
                Response.send(res, {
                    success     : true,
                    dictionary  : dictionary
                });
            } else {
                Response.send(res, {
                    success     : false,
                    dictionary  : dictionary
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
                DictionaryHelper.getDictionaryByQuery({$or: [{_id: {$in: account.dictionaries}}, {access: 0}]}, (err, dictionaries) => {
                    var data = [];
                    
                    for (var i = 0; i < dictionaries.length; i ++) {
                        var item = {};
                        
                        item._id            = dictionaries[i]._id;
                        item.name           = dictionaries[i].name;
                        item.author         = dictionaries[i].author;
                        item.description    = dictionaries[i].description;
                        item.doc_link       = dictionaries[i].doc_link;
                        item.tags           = dictionaries[i].tags;
                        item.images         = dictionaries[i].images;
                        item.keywords       = dictionaries[i].keywords;
                        item.num_install    = dictionaries[i].num_install;
                        item.ratings        = dictionaries[i].ratings;
                        item.access         = dictionaries[i].access;

                        if (account._id.toString() == dictionaries[i].created_by.toString()) {
                            item.isOwner    = true;
                        } else {
                            item.isOwner    = false; 
                        }

                        data.push(item);
                    }

                    Response.send(res, {
                        success             : true,
                        dictionaries        : data
                    });
                });
            }
        ]);
    }
});

router.post('/edit', (req, res, next) => {
    var dictionaryID = req.body.dictionaryID;
    var email        = req.body.email;
    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            })
        },

        (account, done) => {
            DictionaryHelper.getDictionaryById(dictionaryID, (err, dictionary) => {
                if (dictionary.created_by == account._id) {
                    done();
                } else {
                    Response.send(res, {success: false});
                }
            });
        },

        (done) => {
            DictionaryHelper.updateDictionaryById(dictionaryID, {
                name                : req.body.name,
                updated_at          : new Date(),
                description         : req.body.description,
                access              : req.body.access,
                doc_link            : req.body.doc_link,
                tags                : req.body.tags,
                keywords            : req.body.keywords,
                license_type        : req.body.license_type,
                license_method      : req.body.license_method,
                license_cost        : req.body.license_cost,
                images          : JSON.parse(req.body.images)
            }, (err, success) => {
                Response.send(res, {success: success});
            });
        }
    ]); 
});

router.post('/delete', (req, res, next) => {
    var dictionaryID = req.body.dictionaryID;
    DictionaryHelper.deleteDictionaryById(dictionaryID, (err, sucess) => {
        Response.send(res, {success: true});
    });
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
            DictionaryHelper.save({
                name            : req.body.name,
                created_at      : new Date(),
                author          : user.fullname,
                author_email    : email,
                created_by      : account.id,
                description     : req.body.description,
                access          : req.body.access,
                doc_link        : req.body.doc_link,
                tags            : req.body.tags,
                keywords        : req.body.keywords, 
                images          : JSON.parse(req.body.images),
                license_type    : req.body.license_type,
                license_method  : req.body.license_method,
                license_cost    : req.body.license_cost,
                num_install     : 0
            }, (err, dictionary, success) => {
                if (success) {
                    done(err, account, dictionary);
                } else {
                    Response.send(res, {success: false});
                }
            });
        },

        (account, dictionary, done) => {
            account.dictionaries.push(String(dictionary._id));
            account.save((err) => {
                Response.send(res, {success: true});
            });
        }
    ]);
});

uploadImageToS3 = (index, images, userID, array_url, s3bucket, callback) => {
    if (index < images.length) {
        buf = new Buffer(images[index].replace(/^data:image\/\w+;base64,/, ""),'base64')
        var data = {
            Key: userID, 
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/png'
        };
        s3Bucket.putObject(data, function(err, data){
            if (err) { 
                console.log(err);
                console.log('Error uploading data: ', data); 
            } else {
                console.log('succesfully uploaded the image!');
            }
        });
    } else {
        callback(err, array_url)
    }
}

var sort_by = function(field, reverse){
    return function (a, b) {
        if (field == 'title') {
            return reverse * ((a.name.toUpperCase() > b.name.toUpperCase()) - (b.name.toUpperCase() > a.name.toUpperCase()));
        } else if (field == 'items') {
            a_count = a.keywords.split(',').length + a.images.length;
            b_count = b.keywords.split(',').length + b.images.length;
            return reverse * ((a_count > b_count) - (b_count > a_count));
        } else if (field == 'ratings') {
            return reverse * ((a.ratings > b.ratings) - (b.ratings > a.ratings));
        } else if (field == 'num_install') {
            return reverse * ((a.num_install > b.num_install) - (b.num_install > a.num_install));
        } else if (field == 'author') {
            return reverse * ((a.author.toUpperCase() > b.author.toUpperCase()) - (b.author.toUpperCase() > a.author.toUpperCase()));
        }
    } 
}

module.exports = router;
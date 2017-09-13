var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var flash         = require('express-flash');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var passport      = require('passport');
var localStrategy = require('passport-local').Strategy;
var sassMiddleWare= require('node-sass-middleware');
var i18n          = require('i18next');
var AWS           = require('aws-sdk');
var app           = express();
var server        = require('http').Server(app);
var io            = require('socket.io')(server);
var mongoStore    = require('connect-mongo')({
    session: session
});

function WeLink(config) {
    this.init = () => {
        app.locals.appdata = config.appData;
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(session({
            saveUninitialized: false,
            resave: true,
            cookie: {
                secure: true,
                httpOnly: false,
                domain: config.getBaseConfig().siteRoot,
                maxAge: 30 * (24 * 60 * 60 * 1000)
            },
            name: 'cookie',
            secret: 'session',
            secure: true,
            store: new mongoStore({
                mongooseConnection: mongoose.connection
            })
        }));
        app.use(flash());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/locales', express.static(__dirname + '/locales'));
        app.use(require('./controllers'));
    };

    this.initSocketConnection = () => {
        app.use((req, res, next) => {
            res.io = io;
            next();
        });
    };

    this.initi18next = () => {
        i18n.init({
            supportedLngs: ['en', 'es', 'fr', 'ch', 'de', 'nl'],
            ignoreRoutes: ['font/', 'images/', 'javascripts/', 'stylesheets/']
        });
        app.use(i18n.handle);
        i18n.registerAppHelper(app);
    };

    this.initSassMiddleWare = () => {
        var srcPath = __dirname + "/views/sass";
        var destPath = __dirname + "/public/css";

        app.use('/css', sassMiddleWare({
            src: srcPath,
            dest: destPath,
            debug: true,
            outputStyle: 'expanded'
        }));
    }

    this.connectMongoDB = () => {
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, '[ERROR] Database loading error\n[ERROR]'));
        db.once('open', function() {
            console.log("[INFO] Connection to database established");
        });

        mongoose.connect(config.db.type + '://' + config.db.servers[0] + '/' + config.db.name, function(err, db) {
        })
    };

    this.initAWS_S3 = () => {
        AWS.config.update({ accessKeyId: '...', secretAccessKey: '...' });
        var s3bucket = new AWS.S3({ params: {Bucket: 'myBucket'}});
        app.use((req, res, next) => {
            res.s3bucket = s3bucket;
            next();
        });
    }

    this.initializePassport = () => {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });
    };

    this.initErrorHandler = () => {
        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error/error', {'message':err.message});
        });
    };

    this.start = () => {
        var self = this;
        self.initi18next();
        self.initSassMiddleWare();
        self.initSocketConnection();
        self.connectMongoDB();
        self.initAWS_S3();
        self.init();
        self.initializePassport();
        self.initErrorHandler();
    };
};

WeLink.startInstance = () => {
    var Configuration = require('./config.js');
    var config = Configuration.load();
    var welink = new WeLink(config);
    welink.start();
    return welink;
}

WeLink.startInstance();

module.exports = {app: app, server: server};

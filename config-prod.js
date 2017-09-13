'use strict';

var fs          = require('fs');
var path        = require('path');
var cluster     = require('cluster');
var extend      = require('node.extend');


function Configuration() {
}

/*
    * Document Root
    * @static
    * @readonly
    * @property DOCUMENT_ROOT
    * @type {String}
*/
Configuration.DOCUMENT_ROOT = __dirname;

/*
    * The model files absolute path
    * @private
    * @static
    * @readonly
    * @property LOG_DIR
    * @type     {String}
*/
Configuration.MODEL_DIR = path.join(__dirname, 'models');

/*
    * @private
    * @static
    * @readonly
    * @property LOG_DIR
    * @type     {String}
*/
var LOG_DIR                 = path.join(Configuration.DOCUMENT_ROOT, 'log');

/*
    * The default logging directory absolute path
    * @private
    * @static
    * @readonly
    * @property LOG_File
    * @type     {String}
*/
var LOG_File                = path.join(LOG_DIR, 'welink.log');

/*
    * The configuration module overrides file name
    * @private
    * @static
    * @readonly
    * @property CONFIG_MODULE_NAME
    * @type     {String}
*/
var CONFIG_MODULE_NAME      = 'config.js';

/*
    * The default list of absolute file path to try when loading the configuration
    * @private
    * @static
    * @readonly
    * @property OVERRIDE_FILE_PATHS
    * @type     {Array}
*/
var OVERRIDE_FILE_PATHS     = [
    path.join(Configuration.DOCUMENT_ROOT, CONFIG_MODULE_NAME),
];

/*
    * Retrieve the base configuration
*/

Configuration.getBaseConfig = function(multisite) {
    return {
        siteName: 'mycroft',
        product: 'Mycroft',
        siteRoot: 'https://mycroft.cloud',
        siteIP: '0, 0, 0, 0',
        sitePort: process.env.port || process.env.PORT || 3000,
        slaveURL: "https://mycroft.cloud:4848/api/v1",
        multisite: {
            enabled: false,
            globalRoot: 'http://global.localhost:8080'
        },
        db: {
            type: 'mongodb',
            servers: [
                'DR12:C7M212p5m6Ph3gDo2GmgTGP@mongo1:7017'
            ],
            name: 'DR12',
            options: {
                w: 1
            },
            //PB provides the ability to log queries.  This is handy during
            //development to see how many trips to the DB a single request is
            //making.  The queries log at level "info".
            query_logging: false,

            //http://mongodb.github.io/node-mongodb-native/api-generated/db.html#authenticate
            authentication: {
                un: "DR12",
                pw: "C7M212p5m6Ph3gDo2GmgTGP",
                options: {
                    //authMechanism: "MONGODB-CR"|"GSSAPI"|"PLAIN", //Defaults to MONGODB-CR
                    authdb: "DR12", //Defaults to the db attempted to be connected to
                    //authSource: "db name here", //Defaults to value of authdb
                }
            },

            skip_index_check: false,
        },
        appData: {
            product: 'Mycroft',
            contactEmail: "contact@mycroft.cloud"
        },
        mailService: {
            service: 'SendGrid',
            auth: {
                user: 'kdees912',
                pass: '$KDees%2007124',
            }
        },
        cache: {
            fake: true,
            host: 'localhost',
            port: 6379
        },
        session: {
            storage: 'redis',
            timeout: 2000000
        },
        logging: {
            level: 'info',
            file: LOG_File,
            showErrors: true
        },
        settings: {
            use_memory: true,
            use_cache: false,
            memory_timeout: 0
        },
        templates: {
            use_memory: true,
            use_cache: false,
            syncSettingsAtStartup: false,
            memory_timeout: 0
        },
        registry: {
            enabled: true,
            logging_enabled: false,
            type: 'redis',
            update_interval: 10000,
            key: 'server_registry'
        },
        cluster: {
            fatal_error_timeout: 2000,
            fatal_error_count: 5,
            workers: 1,
            self_managed: true
        },
        server: {
            ssl: {
                enabled : true,
                handoff_port: 3000,
                handoff_ip: '0.0.0.0',
                use_x_forwarded: false,
                use_handoff_port_in_redirect: false,
                key: 'ssl/server.key',
                cert: 'ssl/server.pem',
                chain: null
            },
            x_powered_by: 'welink'
        },
        command: {
            borker: 'redis',
            timeout: 3000
        },
        media: {
            provider: 'fs',
            parent_dir: 'public',
            urlRoot: '',
            max_upload_size: 2 * 1024 * 1024
        },
        localization: {
            defaultLocale: 'en-US'
        },
        version: require(path.join(Configuration.DOCUMENT_ROOT, 'package.json')).version
    };
};

Configuration.load = (filePaths) => {
    if (filePaths != undefined) {
        filePaths = [filePaths];
    } else  if (!filePaths) {
        filePaths = OVERRIDE_FILE_PATHS;
    }

    var override = {};
    var overrideFile = null;
    var overridesFound = false;
    for (var i = 0; i < filePaths.length; i++) {
        overrideFile = filePaths[i];
        if (fs.existsSync(overrideFile)) {
            try {
                override        = require(overrideFile);
                overridesFound  = true;
                break;
            } catch (e) {
                console.log('SystemStartup: Failed to parse configuration file [%s]: %s', overrideFile, e.stack);
            }
        }
    }

    return Configuration.mergeWithBase(override);
};

Configuration.mergeWithBase = (overrides) => {
    var multisite = overrides && overrides.multisite? overrides.multisite.enabled : false;
    var baseConfig = Configuration.getBaseConfig(multisite);
    var config = extend(true, baseConfig, overrides);

    if (config.siteRoot.lastIndexOf('/') === (config.siteRoot.length - 1)) {
        config.siteRoot = config.siteRoot.substring(0, config.siteRoot.length - 1);
    }

    if (config.media.urlRoot.lastIndexOf('/') === (config.media.urlRoot.length - 1)) {
        config.media.urlRoot = config.media.urlRoot.substring(0, config.media.urlRoot.length - 1);
    }
    return config;
}

module.exports = Configuration;

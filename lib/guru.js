/*
 * express-lingua
 * A i18n middleware for the Express.js framework.
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2011, 
 *      André König (andre.koenig -[at]- gmail [*dot*] com)
 *      Christian Berkhoff (christian.berkhoff - [at] - gmail [#dot#] com)
 */

var fs = require('fs');
var Resource = require('./resource');

module.exports = (function() {

    var _name = 'lingua:Guru';

    //
    // summary:
    //     Guru learns the languages.
    //
    // description:
    //     Loads all i18n resource files, parses and persists
    //     them in the resource cache (see above).
    //
    // exception:
    //     If there is no i18n resource file for the configured
    //     default language the guru has to throw an error.
    //
    var Guru = function(configuration) {
        if (!configuration) {
            throw new Error(_name + ': Please pass the configuration to the constructor.');
        } else {
            this.configuration = configuration;
        }

        var that = this;

        // The i18n resources
        this.resources = {};

        var path = configuration.resources.path;
        var files = fs.readdirSync(path);

        // Instantiate the resources and their caches.
        files.forEach(function(file) {
            if (fs.statSync(path + file).isFile()) {
                var r = new Resource(path, file, that.configuration.resources.serialisation);
                that.resources[r.locale] = r;
                console.log(_name + ' "' + r.locale + '" found.');
            }
        });

        // Add the global resource for fallbacks
        for(var i in this.resources){
            var r = this.resources[i];
            if(!r.isGlobal() && that.resources[r.language]){
                console.log(_name + ': Setting "' + r.language + '" as global of "' + r.locale + '"');
                r.global = that.resources[r.language];
            }
        };

        // Check if the resource for the default
        // locale is available. If not, well, ERROR!
        if(this.resources[this.configuration.resources.defaultLocale] == undefined) {
            throw new Error(_name + ': Please create a resource file for your default locale: '+this.configuration.resources.defaultLocale);
        }
    };

    //
    // summary:
    //     Shares his language knowledge.
    //
    // description:
    //     Returns the complete i18n object which was defined in
    //     the language file by the given language code.
    //     So if the "locale" is "de-de" then the guru will return
    //     the content which was defined in the "de-de.json" file.
    //
    Guru.prototype.ask = function(locales) {
        var that = this;

        var resource, i;

        for (i = 0; i < locales.length; i++) {
            resource = that.resources[locales[i].toLowerCase()];

            if (resource) {
                break;
            }
        }

        if (!resource) {
            resource = that.resources[that.configuration.resources.defaultLocale];
        }

        return resource;
    };

    return Guru;
}());
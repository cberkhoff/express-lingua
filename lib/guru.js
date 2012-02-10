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

        //     The i18n resource cache.
        this.resources = new Array();

        var path = configuration.resources.path;
        var files = fs.readdirSync(path);

        files.forEach(function(file) {
            if (fs.statSync(path + file).isFile()) {
                var content = fs.readFileSync(path + file);

                var localeName = file.replace(that.configuration.resources.serialisation, '').toLowerCase();
                var country = "zz"
                var lang = localeName;
                var i = localeName.indexOf('-');
                if (i > 0) {
                    country = localeName.slice(i + 1).toLowerCase();
                    lang = localeName.slice(0, i).toLowerCase();
                }

                var resource = {
                    locale: localeName,
                    content: JSON.parse(content),
                    country: country,
                    language: lang
                };

                that.resources[resource.locale] = resource;
            }
        });

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
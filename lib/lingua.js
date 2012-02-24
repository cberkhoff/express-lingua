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
 *
 */
var Guru = require('./guru');
var Trainee = require('./trainee');

module.exports = function(app, options) {

    var _name = 'lingua';

    //
    // The lingua configuration object.
    //
    var configuration = {
        storage: {
            key: 'language'
        },
        resources: {
            defaultLocale: options.defaultLocale.toLowerCase(),
            path: options.path,
            serialisation: '.json'
        }
    };

    //
    // Verify the given parameters.
    //
    // So the middleware init call should look like:
    //
    //     app.configure(function() {
    //         // Lingua configuration
    //         app.use(lingua(app, {
    //             defaultLocale: 'en',
    //             path: __dirname + '/i18n'
    //         }));
    //     });
    //
    // It is necessary to define the "default locale" and the "path"
    // where lingua finds the i18n resource files.
    //
    if (!configuration.resources.defaultLocale) {
        throw new Error(_name + ': Please define a default locale while registering the middleware.');
    }

    if (!configuration.resources.path) {
        throw new Error(_name + ': Please define a path where ' + _name +  ' can find your locales.');
    } else {
        if (configuration.resources.path[configuration.resources.path.length] !== '/') {
            configuration.resources.path = configuration.resources.path + '/';
        }
    }

    //
    // Creating the mighty guru object which knows everything.
    //
    var guru = new Guru(configuration);

    //
    // Creating the trainee object which is like a helper for the guru.
    //
    var trainee = new Trainee(configuration);

    // Receives a key separated by dots (e.g. key.to.node.in.locale.json)
    // and returns the related node.
    // If the current locale doesnt have the key defined, Resource looks
    // if the global language has the key as a fallback.
    // If neither worked, the key is returned.
    var translate = function(key, resource) {
        // Helper function
        var translateWithScope = function(keys, scope) {
            if(keys.length == 0){
                return scope;
            } else {
                ckey = keys.shift();
                if(scope[ckey]){
                    return translateWithScope(keys, scope[ckey]);
                } else {
                    return undefined;
                }
            }

        };

        // split and create a NEW array
        var tc = translateWithScope(key.split('.'), resource.cache);

        if(tc){
            // key found! just return.
            return tc;
        }

        if(!resource.isGlobal() && resource.global){
            // if there is no key, and we are not global (e.g. 'es')
            // then look for the key in the global locale.
            var tf = translateWithScope(key.split('.'), resource.global.cache);
            if(tf){
                // fallback key found!
                return tf;
            }
        }

        // nothing found, return the key
        return key;
    }

    //
    // summary:
    //     Inits the view helper.
    //
    // description:
    //     To be able to access the defined i18n resource in
    //     the views, we have to register a dynamic helper. With
    //     this it is possible to access the text resources via
    //     the following directive. Be aware that it depends on
    //     the syntax of the used template engine. So for "jqtpl"
    //     it would look like:
    //
    //         ${lingua.attribute}
    //
    //     # Example #
    //     
    //     de-de.json:
    //         {
    //             "title": "Hallo Welt",
    //             "content": {
    //                 "description": "Eine kleine Beschreibung."
    //             }
    //         }
    //
    //     en.json:
    //         {
    //             "title": "Hello World",
    //             "content": {
    //                 "description": "A little description."
    //             }
    //         }
    //
    //     index.html (de-de in the HTTP request header):
    //         <h1>${lingua.title}</h1> <!-- out: <h1>Hallo Welt</h1> -->
    //         <p>${lingua.content.description}</h1> <!-- out: <p>Eine kleine Beschreibung.</p> -->
    //
    //
    app.dynamicHelpers({
        resource: function(req, res){
            return res.lingua;
        },
        t: function(req, res){
            return function(key){
                return translate(key, res.lingua);
            }
        },
        currentLocale: function(req, res){
            return res.lingua.locale;
        },
        currentCountry: function(req, res){
            return res.lingua.country;
        },
        currentCountryLanguage: function(req, res){
            return res.lingua.language;
        }
    });

    //
    // summary:
    //     The middleware function.
    //
    // description:
    //     This function will be called on every single
    //     HTTP request.
    //
    return function lingua(req, res, next) {
        //
        // Determine the locale in this order:
        // 1. URL query string, 2. Cookie analysis, 3. header analysis
        //

        // a list with the locales the user wants in "his"
        // preference order
        var locales = trainee.determineLocales(req, res);

        var resource = guru.ask(locales);
        var locale = resource.locale;

        trainee.persist(req, locale);

        res.lingua = resource;
        //res.lingua.locales = locales;

        next();
    };
};
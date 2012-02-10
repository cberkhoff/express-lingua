/*
 * express-lingua
 * A i18n middleware for the Express.js framework.
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2012, 
 *      Christian Berkhoff (christian.berkhoff - [at] - gmail [#dot#] com)
 */
var fs = require('fs');

 module.exports = (function() {

    var _name = 'lingua:Resource';

    var Resource = function(path, file, serialisation, resources) {
    	var self = this;

    	// A Hash with all the other resources. Used for the
    	// fallbacks.
    	this.resources = resources;

    	this.fullPath = path + file;
    	this.cache = JSON.parse(fs.readFileSync(this.fullPath));
		this.locale = file.replace(serialisation, '').toLowerCase();
        
        this.country = "zz"
        this.language = this.locale;
        
        var i = this.locale.indexOf('-');
        if (i > 0) {
            this.country = this.locale.slice(i + 1).toLowerCase();
            this.language = this.locale.slice(0, i).toLowerCase();
        }
    };

    Resource.prototype.isGlobal = function() {
    	return this.language == this.locale;
    }

	// Receives a key separated by dots (e.g. key.to.node.in.locale.json)
	// and returns the related node.
	// If the current locale doesnt have the key defined, Resource looks
	// if the global language has the key as a fallback.
	// If neither worked, the key is returned.
    Resource.prototype.translate = function(key) {
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
    	var tc = translateWithScope(key.split('.'), this.cache);

    	if(tc){
    		// key found! just return.
    		return tc;
    	}

    	if(!this.isGlobal() && this.resources[this.language]){
    		// if there is no key, and we are not global (e.g. 'es')
    		// then look for the key in the global locale.
    		var tf = translateWithScope(key.split('.'), this.resources[this.language].cache);
    		if(tf){
    			// fallback key found!
    			return tf;
    		}
    	}

    	// nothing found, return the key
    	return key;
    }

    return Resource;

}());
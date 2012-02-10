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

    var _name = 'lingua:Resource';

    var Resource = function(path, file, serialisation) {
    	var self = this;

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

    return Resource;

}());
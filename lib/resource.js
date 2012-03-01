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

    lc = function (obj){
        var ret = null;
        if (typeof(obj) == "string" || typeof(obj) == "number")
            return obj;
        else if (obj.push)
            ret = [];
        else
            ret = {};
        for (var key in obj)
            ret[String(key).toLowerCase()] = lc(obj[key]);
        return ret;
    };


    var Resource = function(path, file, serialisation) {
        var self = this;

        self.fullPath = path + file;
        self.cache = lc(JSON.parse(fs.readFileSync(this.fullPath)));
        self.locale = file.replace(serialisation, '').toLowerCase();
        
        self.country = "zz"
        self.language = self.locale;
        
        var i = self.locale.indexOf('-');
        if (i > 0) {
            self.country = self.locale.slice(i + 1).toLowerCase();
            self.language = self.locale.slice(0, i).toLowerCase();
        }


    };

    Resource.prototype.isGlobal = function() {
        return this.language == this.locale;
    }

    return Resource;

}());
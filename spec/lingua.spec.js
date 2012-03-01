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
 var Guru = require("../lib/guru.js");
 var lingua = require("../lib/lingua.js");

 describe('lingua', function() {

  // request hacks to simulate express
  var helpers; 
  var app = {};
  app.dynamicHelpers = function(h){
    helpers = h;
  };

  var lengua;
  var req = {};
  var res = {};

  var translate;

  describe('Lingua', function() {
    it('should start flawlessly', function() {
      lengua = lingua(app, { defaultLocale: 'en-us', path: './i18n/' });
      expect(lengua).toBeDefined();
      expect(helpers.t).toBeDefined();
    });

    it('should work with request hackzord', function() {
      req.url = '';
      req.session = {}; 
      req.session.locale = 'en-us';
      lengua(req, res, function(){});
      translate = helpers.t(req, res);
    });
  });
  
  describe('Translate', function() {
    it('should read from cache', function() {
      r = helpers.resource(req, res);
      expect(r.cache.index.headline).toBe('Hello (in en-US).');
      expect(r.cache.index.subheadline).not.toBeDefined();
    });

    it('should translate with key', function() {
      var t1 = translate('title');
      expect(t1).toBeDefined();
      expect(t1).toBe('first');
    });

    it('should be able to translate nested element', function() {
      var t2 = translate('navigation.german');
      expect(t2).toBeDefined();
      expect(t2).toBe('German');
    });

    it('should have fallbacks', function() {
      var tf = translate('index.subheadline');
      expect(tf).toBeDefined();
      expect(tf).toBe('Test');
    });

    it('should return the key if no value has been found', function() {
      var k = 'index.subheadline.not.found.very.long.also.a.test';
      var tk = translate(k);
      expect(tk).toBeDefined();
      expect(tk).toBe(k);
    });

    it('shoudnt matter the case', function() {
      var t2 = translate('Navigation.gErman');
      expect(t2).toBeDefined();
      expect(t2).toBe('German');
    });

  });


});
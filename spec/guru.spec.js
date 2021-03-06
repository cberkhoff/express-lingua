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

describe('guru', function() {
  // lingua transforms this to lowercase
  var defaultLocale = 'en-us';

	var configuration = {
    storage: {
      key: 'language'
    },
    resources: {
      defaultLocale: defaultLocale,
      path: './i18n/',
      serialisation: '.json'
    }
  };

	var guru;
  var defaultResource;

	describe('Resources', function() {
		it('should start flawlessly', function() {
      guru = new Guru(configuration);
      expect(guru).toBeDefined();
      defaultResource = guru.ask([defaultLocale, 'en']);
      expect(defaultResource).toBeDefined();
      expect(defaultResource.cache).toBeDefined();
      expect(defaultResource.locale).toBeDefined();
      expect(defaultResource.locale).toBe(defaultLocale);
      expect(defaultResource.country).toBe('us');
      expect(defaultResource.language).toBe('en');
		});

    it('should not matter the case', function(){
      crap = guru.ask(['DE-DE']);
      expect(crap).toBeDefined();
      expect(crap.locale).toBeDefined();
      expect(crap.locale).toBe('de-de');
    });

    it('should not find an unregistered locale and use the default', function(){
      crap = guru.ask(['es-cl']);
      expect(crap).toBeDefined();
      expect(crap.locale).toBeDefined();
      expect(crap.locale).toBe(defaultLocale);
    });
	});

  describe('Resources Properties', function(){
    it('should normally have a language and country property', function() {
      expect(defaultResource.country).toBeDefined();
      expect(defaultResource.language).toBeDefined();

      expect(defaultResource.country).toBe('us');
      expect(defaultResource.language).toBe('en');
    });

    it('should have a language property and zz as country if no country is applicable', function() {
      enResource = guru.ask(['en']);
      expect(enResource.country).toBeDefined();
      expect(enResource.language).toBeDefined();

      expect(enResource.country).toBe('zz');
      expect(enResource.language).toBe('en');
    });
  });

});
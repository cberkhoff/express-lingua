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
      expect(defaultResource.content).toBeDefined();
		});

    it('case should not matter', function(){
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

  describe('Resource Properties', function(){
    it('default should have a language and country property', function() {
      expect(defaultResource.country).toBeDefined();
      expect(defaultResource.language).toBeDefined();

      expect(defaultResource.country).toBe('us');
      expect(defaultResource.language).toBe('en');
    });

    it('en should have a language property and zz as country', function() {
      enResource = guru.ask(['en']);
      expect(enResource.country).toBeDefined();
      expect(enResource.language).toBeDefined();

      expect(enResource.country).toBe('zz');
      expect(enResource.language).toBe('en');
    });
  });

  describe('Translations', function(){
    it('should translate a simple key', function() {
      expect(defaultResource.content.index.headline).toBe('Hello (in en-US).');
    });

    it('should have fallbacks', function() {
      expect(defaultResource.content.index.subheadline).toBeDefined();
      expect(defaultResource.content.index.subheadline).toBe('Test');
    });
  });
});
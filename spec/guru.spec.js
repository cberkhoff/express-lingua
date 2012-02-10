var Guru = require("../lib/guru.js");

describe('guru', function() {
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

    it('should not find an unregistered locale and use the default', function(){
      crap = guru.ask(['es-cl']);
      expect(crap).toBeDefined();
      expect(crap.locale).toBeDefined();
      expect(crap.locale).toBe(defaultLocale);
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
var Guru = require("../lib/guru.js");

describe('guru', function() {
	var configuration = {
    storage: {
      key: 'language'
    },
    resources: {
      defaultLocale: 'en-us',
      path: './i18n/',
      serialisation: '.json'
    }
  };

	var guru;
  var enUsResource;

	describe('Resources', function() {
		it('should start flawlessly', function() {
      guru = new Guru(configuration);
      expect(guru).toBeDefined();
      enUsResource = guru.ask(['en-us', 'en']);
      expect(enUsResource).toBeDefined();
		});
	});

  describe('Translations', function(){
    it('should translate a simple key', function() {
      expect(enUsResource.content).toBeDefined();
      expect(enUsResource.content.HeadLine).toBe('Hello (in en-US).');
    });
  });
});
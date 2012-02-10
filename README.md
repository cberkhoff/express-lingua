# Lingua and Lengua

[Lingua](https://github.com/akoenig/express-lingua) is a middleware for the Express.js framework that helps you to internationalise your webapp easily. It determines the language of the user agent and pushes the i18n resources to your views.

Lengua is a fork form Lingua which introduces some features.

## Installation

    $ npm install lengua

## Added features

### For the common mortal

1. User locale stored in session instead of cookie

2. Not case sensitive

3. Country Code

4. If the current locale (e.g. en-US) doesnt define a key, Lengua does a lookup in the global locale (e.g. en).

### Other Stuff

1. Tests :)

## TODO

1. Locale storage as strategy (Cookie, Session, Azure, etc).

2. Cache update (when all fallbacks fail).

## Dev

### Tests

<pre>
npm install jasmine-node
cd spec/
jasmine-node.cmd .\guru.spec.js
</pre>

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

Copyright (c) 2011,
 
[André König](http://lochkartenstanzer.de) ([Google+](http://profile.lochkartenstanzer.de)) (andre.koenig -[at]- gmail [*dot*] com)

[Christian Berkhoff](#) (christian.berkhoff - [at] - gmail [#dot#] com)

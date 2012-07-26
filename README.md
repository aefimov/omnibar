##Overview
This extension support search from location bar without installing any native plugins into your system. It simple
javascript extension based on Safari API. Please read notes about Safari 6 and Safari 5 bellow.

To use it check settings in Safari Preferences on Extensions tab. Choose you favorite search engine 
(Yandex is preselected by default, as my company :)). This is Default Search Engine, it will be used 
in any time you typed simple text into Location Bar.

But sometimes you need to search over Facebook, Wikipedia or WolframAlpha, not by your selected _Default Search Engine_.
To do this just prefix search query by shortcut:

* `?` is your _Default Search Engine_ selected in Safari Extensions Settings.
* `y`, `ya` is [Yandex](http://www.yandex.com)
* `g` is [Google](http://google.com)
* `!`, `y!` is [Yahoo!](http://search.yahoo.com)
* `b` is [Bing](http://www.bing.com)
* `d`, `dd` is [DuckDuckGo](http://duckduckgo.com)
* `wa` is [WolframAlpha](http://wolframalpha.com)
* `f`, `fb` is [Facebook](http://facebook.com)
* `w`, `wp`, `wi` is [Wikipedia](http://wikipedia.org)

For example, if your _Default Search Engine_ it not Wikipedia, then you can type 'w Antoine de Saint-Exupéry' in Location Bar
and Safari open Wikipedia page about one greatest writer from Marseille.

If you using shortcut, then OmniBar will think what you not needed to use your default engine, so, it will exclude
_Default Search Engine_ and will search for shortcut in all other.

##Installation
Download [OmniBar.safariextz](https://github.com/downloads/aefimov/omnibar/OmniBar.safariextz) and then open it with Safari.

##Safari 6.x
Since Safari 6 have omnibar on board, this extension maybe obsolete and you can remove it
(especially you not need custom Search Engines). But it still can be used if you requires
to use non standard (Google, Yahoo, Bing) search engines such as DuckDuckGo or Wikipedia.

Since Safari 6 API this extension work pretty well and all bugs with wrong decoding of search 
queries from URL has gone. This extension intercept `beforeSearch` event and do not try to decode
anything from url (as for Safari 5).

##Safari 5.x
Safari 5 has no ability to use `beforeSearch` event, it used `beforeNavigate` event and this make some restrictions
to OmniBar extension. Sometimes it can't handle correctly some queries you typed in location bar. Especialy if it 
contains such symbols as `:`, `+`, `,` etc. Safari force HTTP error before any events sent to OmniBar extension. This 
best way to fix it – is using modern Safari 6.

##How to uninstall OmniBar extension
Simple go into *Safari* menu, then *Preferences*, select tab *Exceptions* select *OmniBar* and click Uninstall button.

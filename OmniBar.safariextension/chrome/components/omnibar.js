var SafariVersion = {
    init: function () {
        this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || 5.0;
    },
    searchVersion: function (s) {
        var index = s.indexOf("Version");
        if (index == -1) return;
        return parseFloat(s.substring(index + 8));
    }
};
SafariVersion.init();

/**
 * Extension entry point.
 *
 * @author Alexey Efimov
 */
Omnibar = new function () {
    this.DEFAULT_EXTENSION_ID = "OmniBar.safariext";
    this.ENGINES = {
        "yandex.ru": this.DEFAULT_ENGINE = {
            shortcuts: ["y", "ya", "я"],
            searchPattern: "yandex.ru/yandsearch?text=${query}&from=${extensionId}",
            httpsAvailable: false,
            group: "yandex"
        },
        "yandex.com": {
            shortcuts: ["y", "ya"],
            searchPattern: "yandex.com/yandsearch?text=${query}&from=${extensionId}",
            httpsAvailable: false,
            group: "yandex"
        },
        "google": {
            shortcuts: ["g"],
            searchPattern: "google.com/search?client=safari&q=${query}&ie=UTF-8&oe=UTF-8&from=${extensionId}",
            httpsAvailable: true
        },
        "yahoo": {
            shortcuts: ["!", "y!"],
            searchPattern: "search.yahoo.com/search?ei=utf-8&p=${query}&fr=${extensionId}",
            httpsAvailable: false
        },
        "bing": {
            shortcuts: ["b"],
            searchPattern: "www.bing.com/search?q=${query}&from=${extensionId}",
            httpsAvailable: false
        },
        "duckduckgo": {
            shortcuts: ["d", "dd"],
            searchPattern: "duckduckgo.com/?q=${query}&from=${extensionId}",
            httpsAvailable: true
        },
        "wolframalpha": {
            shortcuts: ["wa"],
            searchPattern: "wolframalpha.com/input/?i=${query}&from=${extensionId}",
            httpsAvailable: false
        },
        "facebook": {
            shortcuts: ["f", "fb"],
            searchPattern: "facebook.com/search.php?q=${query}&from=${extensionId}",
            httpsAvailable: true
        },
        "wikipedia": {
            shortcuts: ["w", "wp", "wi"],
            searchPattern: "wikipedia.org/wiki/Special:Search/${query}?from=${extensionId}",
            httpsAvailable: true
        }
    };

    this.splitText = function(text) {
        var matches = text.match(/^(?:([^\s]{1,2})\s)?\s*(.*)$/);
        return matches && matches.length === 3 ? {
            prefix: matches[1],
            suffix: matches[2]
        } : {
            suffix: text
        };
    };

    this.toSearchUrl = function (text) {
        var request = this.splitText(text);
        var searchEngine = Omnibar.Settings.getSearchEngine();
        if (request.prefix) {
            // Try to find shortcut
            if (request.prefix === '?') {
                text = request.suffix;
            } else {
                var engine = Omnibar.Settings.findAlternateSearchEngine(request.prefix.toLocaleLowerCase(), searchEngine);
                if (engine && engine != null) {
                    searchEngine = engine;
                    text = request.suffix;
                }
            }
        }
        return Omnibar.Settings.getSearchPattern(searchEngine)
                .replace("${query}", text.trim())
                .replace("${extensionId}", Omnibar.Settings.getExtensionId());
    };

    if (SafariVersion.version < 6.0) {
        // Safari 5.x has not omnibar, we need to parse entered url
        safari.application.addEventListener("beforeNavigate", function (event) {
            Omnibar.Inspector.decodeSearchQueryFromUrl(event.url, function(text) {
                safari.application.activeBrowserWindow.activeTab.url = Omnibar.toSearchUrl(text);
                event.preventDefault();
            });
        }, false);
    } else {
        // Safari 6.x has omnibar itself, and event 'beforeSearch'
        safari.application.addEventListener("beforeSearch", function (event) {
            if (event.query) {
                safari.application.activeBrowserWindow.activeTab.url = Omnibar.toSearchUrl(event.query);
                event.preventDefault();
            }
        }, false);
    }
}();

Omnibar.Settings = new function() {
    this.getExtensionId = function () {
        var extensionId = safari.extension.settings.extensionId;
        if (extensionId == null) {
            return Omnibar.DEFAULT_EXTENSION_ID;
        }
        return extensionId;
    };

    this.getSearchEngine = function() {
        var engine = Omnibar.ENGINES[safari.extension.settings.searchEngineId];
        if (!engine || engine == null) {
            engine = Omnibar.DEFAULT_ENGINE;
        }
        return engine;
    };

    this.findAlternateSearchEngine = function(shortcut, defaultEngine) {
        // Look only all other engines, if user try to specify shortcut
        for (var engineId in Omnibar.ENGINES) {
            if (Omnibar.ENGINES.hasOwnProperty(engineId)) {
                var engine = Omnibar.ENGINES[engineId];
                var group = engine.group || "";
                if (engine && engine !== defaultEngine &&
                        group !== defaultEngine.group &&
                        engine.shortcuts.indexOf(shortcut) != -1) {
                    return engine;
                }
            }
        }
        return null;
    };

    this.getSearchPattern = function(engine) {
        return (safari.extension.settings.useHttps && engine.httpsAvailable ? "https" : "http") +
                "://" + engine.searchPattern;
    };
}();

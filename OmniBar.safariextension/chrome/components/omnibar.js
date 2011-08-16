/**
 * Extension entry point.
 *
 * @author Alexey Efimov
 */
Omnibar = new function () {
    this.DEFAULT_EXTENSION_ID = "OmniBar.safariext";
    this.DEFAULT_PATTERN = "http://yandex.ru/yandsearch" +
            "?text=${query}" +
            "&from=${extensionId}";

    this.toSearchUrl = function (text) {
        return Omnibar.Settings.getSearchPattern()
                .replace("${query}", text)
                .replace("${extensionId}", Omnibar.Settings.getExtensionId());
    };

    safari.application.addEventListener("beforeNavigate", function (event) {
        Omnibar.Inspector.applyForSimpleText(event.url, function(text) {
            safari.application.activeBrowserWindow.activeTab.url = Omnibar.toSearchUrl(text);
            event.preventDefault();
        });
    }, false);
}();

Omnibar.Settings = new function() {
    this.getExtensionId = function () {
        var extensionId = safari.extension.settings.extensionId;
        if (extensionId == null) {
            return Omnibar.DEFAULT_EXTENSION_ID;
        }
        return extensionId;
    };
    this.getSearchPattern = function () {
        var searchPattern = safari.extension.settings.searchPattern;
        if (searchPattern == null) {
            return Omnibar.DEFAULT_PATTERN;
        }
        return searchPattern;
    };
}();

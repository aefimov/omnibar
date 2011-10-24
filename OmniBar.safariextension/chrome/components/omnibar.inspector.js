/**
 * Inspector for URLs that contains not valid address (simple text).
 * To detect error typing search request into address box and redirect
 * it to search engine.
 *
 * @author Alexey Efimov
 */
Omnibar.Inspector = new function () {
    this.decodeUrlToText = function (url) {
        var urlRe = /^http:\/\/?([^\/]+)\/?$/i;
        if (url != null && url.match(urlRe)) {
            // Cut 'http://' prefix and tailing '/' if exists
            var matchedUrl = url.replace(urlRe, "$1");
            // Unwrap '%20' to spaces, etc
            var unescapedUrl = unescape(matchedUrl);
            // Finally it can be punycode encoded, decode it
            return Punycode.ToUnicode(unescapedUrl);
        }
        return null;
    };

    // Those rules detect URLs
    this.excludeRules = function (text) {
        return text.match(/^[a-z]+$/) || // This is short domain name in lowercase, do not search it
                text.match(/^[^\s]+:\d+$/) || // This is domain name with port specified, do not search it
                text.match(/\d+\.\d+\.\d+\.\d+(?::\d+)?$/) || // This is IP address, do not search it
                text.match(/^[^:]+:[^@]+@/) || // This is username and password specified in url, do not search it
                text.match(/\.[^\s\d\.,<>!@~`#\$%\^&\*\(\)\-_\+=\{\}\[\]\|\\\/;:"']{2,}$/); // This is valid domain suffix, do not search it
    };

    // Those rules detect 'simple text'
    this.includeRules = function (text) {
        return text.match(/[\s]/); // We have spaces in host name
    };

    this.isSimpleText = function (text) {
        return text != null && (this.includeRules(text) || !this.excludeRules(text));
    };

    this.applyForSimpleText = function(url, successHandler) {
        if (url && successHandler) {
            var text = this.decodeUrlToText(url);
            if (this.isSimpleText(text)) {
                successHandler(text);
            }
        }
    };
}();


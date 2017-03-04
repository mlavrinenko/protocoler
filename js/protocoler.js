(function(w, d, l) {
    var f = {
        options: {},
        
        loaded: function() {
            f.options = f.defaultOptions;
            chrome.storage.sync.get(f.defaultOptions, function(options) {
                f.options = options;
            });

            f.listen('click', function(e) {
                var link = e.target;

                if (
                    link.tagName != 'A' ||
                    e.button != f.options.useStyleClick ||
                    (f.options.useStyleMod && ! e[f.options.useStyleMod+'Key'])
                ) {
                    return;
                }

                var url = f.parseUrl(link.href);

                var foundRule = null;
                for (var ruleNum in f.options.rules) {
                    //noinspection JSUnfilteredForInLoop
                    var rule = f.options.rules[ruleNum];

                    if ( ! url.host.match(new RegExp(rule.host)) ) {
                        continue;
                    }

                    if ( ! url.path.match(new RegExp(rule.path)) ) {
                        continue;
                    }

                    foundRule = rule;
                    break;
                }

                if ( ! foundRule ) {
                    return;
                }

                w.open(foundRule.protocol+'://' + link.href, '_self');
                e.preventDefault();
            }, true);
        }
    };

    Object.assign(f, w.f);

    f.listen('DOMContentLoaded', f.loaded);
})(window, document, location);
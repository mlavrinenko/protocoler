(function(w, d, l) {
    var f = {
        loaded: function() {
            f.restoreOptions();

            f.get('save').addEventListener('click', f.saveOptions);
            f.get('add').addEventListener('click', f.addRule);
        },

        restoreOptions: function() {
            chrome.storage.sync.get(f.defaultOptions, function(options) {
                options.rules.forEach(function(rule) {
                    f.addRule(rule);
                });

                f.get('use_style_click').value = options.useStyleClick;
                f.get('use_style_mod').value = options.useStyleMod;
            })
        },

        saveOptions: function() {
            chrome.storage.sync.set(f.getOptions());
        },

        getOptions: function() {
            var options = {
                rules: [],
                useStyleClick: f.get('use_style_click').value,
                useStyleMod: f.get('use_style_mod').value
            };

            f.get('rules').querySelectorAll('.rule').forEach(function(ruleDiv) {
                var rule = {};
                f.ruleFields.forEach(function(field) {
                    var value = ruleDiv.querySelector('[name='+field+']').value;
                    if ( value == '' ) {
                        return;
                    }

                    rule[field] = value;
                });

                if ( Object.keys(rule).length != f.ruleFields.length ) {
                    return;
                }

                options.rules.push(rule);
            });

            return options;
        },

        addRule: function(rule) {
            rule = rule || {};

            var ruleTemplate = f.get('rule_template').cloneNode(true);
            ruleTemplate.id = null;

            f.ruleFields.forEach(function(field) {
                if ( ! rule.hasOwnProperty(field) ) {
                    return;
                }

                ruleTemplate.querySelector('[name='+field+']').value = rule[field];
            });

            f.get('rules').appendChild(ruleTemplate);

            return ruleTemplate;
        }
    };

    Object.assign(f, w.f);

    d.addEventListener('DOMContentLoaded', f.loaded);
})(window, document, location);
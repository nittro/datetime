_context.invoke('Utils', function(DateTime, Strings) {

    function buildParser(locale) {
        var i;

        if (!('months' in locale.parsers)) {
            locale.parsers.months = [];

            for (i = 0; i < 12; i++) {
                locale.parsers.months.push(Strings.escapeRegex(locale.keywords.months.full[i]) + '|' + Strings.escapeRegex(locale.keywords.months.abbrev[i]));
            }
        }

        if (!('weekdays' in locale.parsers)) {
            locale.parsers.weekdays = [];

            for (i = 0; i < 7; i++) {
                locale.parsers.weekdays.push(Strings.escapeRegex(locale.keywords.weekdays.full[i]) + '|' + Strings.escapeRegex(locale.keywords.weekdays.abbrev[i]));
            }
        }

        var parts = [
            '^',
            '(?:',
                '(?:',
                    '(', locale.parsers.now, ')|',
                    '(', locale.parsers.yesterday, ')|',
                    '(', locale.parsers.today, ')|',
                    '(', locale.parsers.tomorrow, ')|',
                    '(?:',
                        '(', locale.parsers.firstOf, ')|',
                        '(', locale.parsers.lastOf, ')',
                    ')\\s+(?:',
                        '(', locale.parsers.last, ')|',
                        '(', locale.parsers['this'], ')|',
                        '(', locale.parsers.next, ')',
                    ')\\s+(?:',
                        '(', locale.parsers.year, ')|',
                        '(', locale.parsers.month, ')|',
                        '(', locale.parsers.week, ')',
                    ')',
                    '|',
                    '(?:',
                        '(', locale.parsers.last, ')|',
                        '(', locale.parsers['this'], ')|',
                        '(', locale.parsers.next, ')',
                    ')\\s+(?:',
                        '(', locale.parsers.months.join(')|('), ')',
                        '|',
                        '(', locale.parsers.weekdays.join(')|('), ')',
                    ')',
                ')(?:\\s+|$)',
            ')?',
            '(?:',
                '(?:', locale.parsers.at, '\\s+)?',
                '(?:',
                    '(', locale.parsers.noon, ')|',
                    '(', locale.parsers.midnight, ')|',
                    '([012]?\\d(?::[0-5]\\d(?::[0-5]\\d)?)?(?:\\s*[ap]m)?)',
                ')',
                '(?=[-+]|\\s|$)',
            ')?',
            '(',
                '(?:',
                    '\\s*[-+]?\\s*\\d+\\s+',
                    '(?:',
                        locale.parsers.intervals.year, '|',
                        locale.parsers.intervals.month, '|',
                        locale.parsers.intervals.week, '|',
                        locale.parsers.intervals.day, '|',
                        locale.parsers.intervals.hour, '|',
                        locale.parsers.intervals.minute, '|',
                        locale.parsers.intervals.second, '|',
                        locale.parsers.intervals.millisecond,
                    ')',
                    '(?=[-+]|\\s|$)',
                ')*',
            ')',
            '$'
        ];

        return new RegExp(parts.join(''), 'i');

    }

    function buildIntervalParser(locale) {
        var parts = [
            '\\s*([-+]?)\\s*(\\d+)\\s+',
            '(?:',
                '(', locale.parsers.intervals.year, ')|',
                '(', locale.parsers.intervals.month, ')|',
                '(', locale.parsers.intervals.week, ')|',
                '(', locale.parsers.intervals.day, ')|',
                '(', locale.parsers.intervals.hour, ')|',
                '(', locale.parsers.intervals.minute, ')|',
                '(', locale.parsers.intervals.second, ')|',
                '(', locale.parsers.intervals.millisecond, ')',
            ')\\s*'
        ];

        return new RegExp(parts.join(''), 'ig');

    }

    var i18n = DateTime.i18n = {
        locales: {},

        hasLocale: function(locale) {
            return locale in i18n.locales;
        },

        getLocale: function(locale) {
            if (!i18n.hasLocale(locale)) {
                throw new Error('Unknown locale: ' + locale);
            }

            return i18n.locales[locale];

        },

        getMonth: function(locale, m, abbrev) {
            return i18n.getLocale(locale).keywords.months[abbrev ? 'abbrev' : 'full'][m];
        },

        getWeekday: function(locale, d, abbrev) {
            return i18n.getLocale(locale).keywords.weekdays[abbrev ? 'abbrev' : 'full'][d];
        },

        getConjuction: function(locale) {
            return i18n.getLocale(locale).keywords.conjuction;
        },

        getInterval: function(locale, unit, n) {
            locale = i18n.getLocale(locale);
            n = locale.getPlural(n);
            return locale.keywords.intervals[unit][n];

        },

        getWeekStart: function(locale) {
            return i18n.getLocale(locale).weekStart;
        },

        getParser: function (locale) {
            locale = i18n.getLocale(locale);

            if (!locale.parser) {
                locale.parser = buildParser(locale);
            }

            return locale.parser;

        },

        getIntervalParser: function(locale) {
            locale = i18n.getLocale(locale);

            if (!locale.intervalParser) {
                locale.intervalParser = buildIntervalParser(locale);
            }

            return locale.intervalParser;

        }
    };

});

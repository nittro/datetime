_context.invoke('Utils', function (DateTime) {

    DateTime.i18n.locales.en = {
        getPlural: function(n) { return n === 1 ? 0 : 1; },
        weekStart: 0,
        keywords: {
            weekdays: {
                abbrev: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            months: {
                abbrev: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            },
            intervals: {
                year: ['year', 'years'],
                month: ['month', 'months'],
                week: ['week', 'weeks'],
                day: ['day', 'days'],
                hour: ['hour', 'hours'],
                minute: ['minute', 'minutes'],
                second: ['second', 'seconds'],
                millisecond: ['millisecond', 'milliseconds']
            },
            conjuction: 'and'
        },
        parsers: {
            now: 'now',
            today: 'today',
            tomorrow: 'tomorrow',
            yesterday: 'yesterday',
            at: 'at',
            noon: 'noon',
            midnight: 'midnight',
            last: 'last',
            'this': 'this',
            next: 'next',
            firstOf: 'first(?:\\s+day)?\\s+of',
            lastOf: 'last(?:\\s+day)?\\s+of',
            year: 'year',
            month: 'month',
            week: 'week',
            intervals: {
                year: 'y(?:ears?)?',
                month: 'mon(?:ths?)?',
                week: 'w(?:eeks?)?',
                day: 'd(?:ays?)?',
                hour: 'h(?:ours?)?',
                minute: 'min(?:utes?)?',
                second: 's(?:ec(?:onds?)?)?',
                millisecond: 'millis(?:econds?)?|ms'
            }
        }
    };

});

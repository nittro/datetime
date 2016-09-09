_context.invoke('Utils', function (Utils, undefined) {

    var DateInterval = function (interval, locale) {
        this._ = {
            initialized: false,
            interval: interval,
            locale: locale || Utils.DateTime.defaultLocale
        };
    };

    DateInterval.from = function (interval, locale) {
        return new DateInterval(interval, locale);

    };

    var intervals = [
        'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'
    ];

    var intervalLengths = {
        year: 31536000000,
        month: 2678400000,
        week: 604800000,
        day: 86400000,
        hour: 3600000,
        minute: 60000,
        second: 1000,
        millisecond: 1
    };

    function getValue(interval) {
        if (typeof interval === 'number') {
            return interval;
        } else if (interval instanceof DateInterval) {
            return interval.getLength();
        } else {
            return DateInterval.from(interval).getLength();
        }
    }

    DateInterval.prototype.add = function (interval) {
        this._initialize();
        this._.interval += getValue(interval);
        return this;

    };

    DateInterval.prototype.subtract = function (interval) {
        this._initialize();
        this._.interval -= getValue(interval);
        return this;

    };

    DateInterval.prototype.isNegative = function () {
        this._initialize();
        return this._.interval < 0;

    };

    DateInterval.prototype.getLength = function () {
        this._initialize();
        return this._.interval;

    };

    DateInterval.prototype.valueOf = function () {
        return this.getLength();

    };


    function formatAuto(interval, precision, locale) {
        if (precision === true) {
            precision = 8;

        } else if (!precision) {
            precision = 2;

        }

        var i, v, str = [], last, sign = '';

        if (interval < 0) {
            sign = '-';
            interval = -interval;

        }

        intervals.some(function (i) {
            if (interval >= intervalLengths[i]) {
                precision--;
                v = interval / intervalLengths[i];
                v = precision === 0 ? Math.round(v) : Math.floor(v);
                str.push(v + ' ' + Utils.DateTime.i18n.getInterval(locale, i, v));
                interval -= v * intervalLengths[i];

                if (precision === 0) {
                    return true;

                }
            }
        });

        if (str.length > 2) {
            last = str.pop();
            return sign + str.join(', ') + ' ' + Utils.DateTime.i18n.getConjuction(locale) + ' ' + last;

        } else {
            return sign + str.join(' ' + Utils.DateTime.i18n.getConjuction(locale) + ' ');

        }
    }

    function format(interval, pattern) {
        var sign = interval < 0 ? '-' : '+';
        interval = Math.abs(interval);

        return (pattern + '').replace(/%(.)/g, function (m, f) {
            var v, pad = false;

            switch (f) {
                case '%':
                    return '%';

                case 'y':
                    m = intervalLengths.year;
                    break;

                case 'w':
                    m = intervalLengths.week;
                    break;

                case 'm':
                    pad = true;
                case 'n':
                    m = intervalLengths.month;
                    break;

                case 'd':
                    pad = true;
                case 'j':
                    m = intervalLengths.day;
                    break;

                case 'H':
                    pad = true;
                case 'G':
                    m = intervalLengths.hour;
                    break;

                case 'i':
                    pad = true;
                case 'I':
                    m = intervalLengths.minute;
                    break;

                case 's':
                    pad = true;
                case 'S':
                    m = intervalLengths.second;
                    break;

                case '-':
                    return sign === '-' ? sign : '';

                case '+':
                    return sign;

                default:
                    throw new Error('Unknown format modifier: %' + f);

            }

            v = Math.floor(interval / m);
            interval -= m * v;
            return pad && v < 10 ? '0' + v : v;

        });
    }

    DateInterval.prototype.format = function (pattern) {
        this._initialize();

        if (typeof pattern === 'boolean' || typeof pattern === 'number' || !pattern) {
            return formatAuto(this._.interval, pattern, this._.locale);

        } else {
            return format(this._.interval, pattern);

        }
    };

    DateInterval.prototype._initialize = function () {
        if (this._.initialized) {
            return;
        }

        this._.initialized = true;

        if (typeof this._.interval === 'number') {
            return;

        }

        var interval = this._.interval;

        if (interval instanceof DateInterval) {
            this._.interval = interval.getLength();

        } else if (typeof interval === 'string') {
            if (interval.match(/^\s*(?:\+|-)?\s*\d+\s*$/)) {
                this._.interval = parseInt(interval.trim());

            } else {
                var res = 0,
                    rest;

                rest = interval.replace(Utils.DateTime.i18n.getIntervalParser(this._.locale), function (_, sign, n, y, m, w, d, h, i, s, u) {
                    sign = sign === '-' ? -1 : 1;

                    n = parseInt(n) * sign;

                    y && (n *= intervalLengths.year);
                    m && (n *= intervalLengths.month);
                    w && (n *= intervalLengths.week);
                    d && (n *= intervalLengths.day);
                    h && (n *= intervalLengths.hour);
                    i && (n *= intervalLengths.minute);
                    s && (n *= intervalLengths.second);
                    u && (n *= intervalLengths.millisecond);

                    res += n;

                    return '';

                });

                if (rest.length) {
                    throw new Error('Invalid interval specification "' + interval + '", didn\'t understand "' + rest + '"');

                }

                this._.interval = res;

            }
        } else {
            throw new Error('Invalid interval specification, expected string, number or a DateInterval instance');

        }
    };

    _context.register(DateInterval, 'DateInterval');

});

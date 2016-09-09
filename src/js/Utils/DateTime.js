_context.invoke('Utils', function(Strings, Arrays, DateInterval, undefined) {

	var DateTime = function(d, locale) {
		this._ = {
			initialized: false,
			date: d || new Date(),
            locale: locale || DateTime.defaultLocale
		};
	};

	DateTime.defaultLocale = 'en';

	DateTime.from = function(s, locale) {
		return new DateTime(s, locale);

	};

	DateTime.now = function () {
		return new DateTime();
	};

	DateTime.isDateObject = function(o) {
		return typeof o === 'object' && o && o.date !== undefined && o.timezone !== undefined && o.timezone_type !== undefined;

	};

	DateTime.isLeapYear = function(y) {
		return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;

	};

    DateTime.isModifyString = function (str, locale) {
        return DateTime.i18n.getParser(locale || DateTime.defaultLocale).test(str);
    };

	DateTime.getDaysInMonth = function(m, y) {
	    while (m < 0) { m += 12; y--; }
	    while (m > 12) { m -= 12; y++; }
		return m === 1 ? (DateTime.isLeapYear(y) ? 29 : 28) : (m in {3:1,5:1,8:1,10:1} ? 30 : 31);

	};

	var ni = function() { throw new Error('Not implemented!'); },
		pad = function(n) {
			return (n < 10) ? '0' + n : n;
		};

	var formatTz = function (offset) {
		if ((typeof offset === 'string' || offset instanceof String) && offset.match(/(\+|-)\d\d:\d\d/)) {
			return offset;

		}

		if (typeof offset !== 'number') {
			offset = parseInt(offset);

		}

		return (offset < 0 ? '+' : '-') + pad(parseInt(Math.abs(offset) / 60)) + ':' + pad(Math.abs(offset) % 60)

	};

	DateTime.getLocalTzOffset = function () {
		return formatTz(new Date().getTimezoneOffset());

	};

	DateTime.formatModifiers = {
		d: function(d, u) { return pad(u ? d.getUTCDate() : d.getDate()); },
		D: function(d, u, o) { return DateTime.i18n.getWeekday(o, u ? d.getUTCDay() : d.getDay(), true); },
		j: function(d, u) { return u ? d.getUTCDate() : d.getDate(); },
		l: function(d, u, o) { return DateTime.i18n.getWeekday(o, u ? d.getUTCDay() : d.getDay()); },
		N: function(d, u, n) { n = u ? d.getUTCDay() : d.getDay(); return n === 0 ? 7 : n; },
		S: function(d, u, n) { n = u ? d.getUTCDate() : d.getDate(); n %= 10; return n === 0 || n > 3 ? 'th' : ['st', 'nd', 'rd'][n - 1]; },
		w: function(d, u) { return u ? d.getUTCDay() : d.getDay(); },
		z: function(d, u, n, m, y, M) { n = u ? d.getUTCDate() : d.getDate(); n--; y = u ? d.getUTCFullYear() : d.getFullYear(); m = 0; M = u ? d.getUTCMonth() : d.getMonth(); while (m < M) n += DateTime.getDaysInMonth(m++, y); return n; },
		W: ni,
		F: function(d, u, o) { return DateTime.i18n.getMonth(o, u ? d.getUTCMonth() : d.getMonth()); },
		m: function(d, u) { return pad((u ? d.getUTCMonth() : d.getMonth()) + 1); },
		M: function(d, u, o) { return DateTime.i18n.getMonth(o, u ? d.getUTCMonth() : d.getMonth(), true); },
		n: function(d, u) { return (u ? d.getUTCMonth() : d.getMonth()) + 1; },
		t: function(d, u) { return DateTime.getDaysInMonth(u ? d.getUTCMonth() : d.getMonth(), u ? d.getUTCFullYear() : d.getFullYear()); },
		L: function(d, u) { return DateTime.isLeapYear(u ? d.getUTCFullYear() : d.getFullYear()) ? 1 : 0; },
		o: ni,
		Y: function(d, u) { return u ? d.getUTCFullYear() : d.getFullYear(); },
		y: function(d, u) { return (u ? d.getUTCFullYear() : d.getFullYear()).toString().substr(-2); },
		a: function(d, u, h) { h = u ? d.getUTCHours() : d.getHours(); return h >= 0 && h < 12 ? 'am' : 'pm'; },
		A: function(d, u) { return DateTime.formatModifiers.a(d, u).toUpperCase(); },
		g: function(d, u, h) { h = u ? d.getUTCHours() : d.getHours(); return h === 0 ? 12 : (h > 12 ? h - 12 : h); },
		G: function(d, u) { return u ? d.getUTCHours() : d.getHours(); },
		h: function(d, u) { return pad(DateTime.formatModifiers.g(d, u)); },
		H: function(d, u) { return pad(u ? d.getUTCHours() : d.getHours()); },
		i: function(d, u) { return pad(u ? d.getUTCMinutes() : d.getMinutes()); },
		s: function(d, u) { return pad(u ? d.getUTCSeconds() : d.getSeconds()); },
		u: function(d, u) { return (u ? d.getUTCMilliseconds() : d.getMilliseconds()) * 1000; },
		e: ni,
		I: ni,
		O: function (d, u) { return DateTime.formatModifiers.P(d, u).replace(':', ''); },
		P: function (d, u) { return u ? '+00:00' : formatTz(d.getTimezoneOffset()); },
		T: ni,
		Z: function (d, u) { return u ? 0 : d.getTimezoneOffset() * -60; },
		c: function (d, u) { return DateTime.from(d).format('Y-m-d\\TH:i:sP', u); },
		r: function (d, u) { return DateTime.from(d).format('D, n M Y G:i:s O', u); },
		U: function(d) { return Math.round(d.getTime() / 1000); }
	};

	DateTime.prototype.format = function(f, utc) {
		this._initialize();

		var date = this._.date,
            locale = this._.locale,
			pattern = Arrays.getKeys(DateTime.formatModifiers).map(Strings.escapeRegex).join('|'),
			re = new RegExp('(\\\\*)(' + pattern + ')', 'g');

		return f.replace(re, function(s, c, m) {
			if (c.length % 2) {
				return c.substr(1) + m;

			}

			return c + '' + (DateTime.formatModifiers[m](date, utc, locale));

		});
	};

	DateTime.prototype.getLocale = function () {
        return this._.locale;
    };

	DateTime.prototype.setLocale = function (locale) {
	    if (!DateTime.i18n.hasLocale(locale)) {
	        throw new Error('Unknown locale: ' + locale);
        }

        this._.locale = locale;
        return this;

    };

	[
        'getTime',
        'getDate', 'getDay', 'getMonth', 'getFullYear',
        'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds', 'getTimezoneOffset',
        'getUTCDate', 'getUTCDay', 'getUTCMonth', 'getUTCFullYear',
        'getUTCHours', 'getUTCMinutes', 'getUTCSeconds', 'getUTCMilliseconds',
        'toDateString', 'toISOString', 'toJSON',
        'toLocaleDateString', 'toLocaleFormat', 'toLocaleTimeString',
        'toString', 'toTimeString', 'toUTCString'
    ].forEach(function (method) {
        DateTime.prototype[method] = function () {
            this._initialize();
            return this._.date[method].apply(this._.date, arguments);

        };
    });

    [
        'setTime',
        'setDate', 'setMonth', 'setFullYear',
        'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds',
        'setUTCDate', 'setUTCMonth', 'setUTCFullYear',
        'setUTCHours', 'setUTCMinutes', 'setUTCSeconds', 'setUTCMilliseconds'
    ].forEach(function (method) {
        DateTime.prototype[method] = function () {
            this._initialize();
            this._.date[method].apply(this._.date, arguments);
            return this;

        };
    });

	DateTime.prototype.getTimestamp = function() {
		this._initialize();
		return Math.round(this._.date.getTime() / 1000);

	};

	DateTime.prototype.getDateObject = function () {
		this._initialize();
		return this._.date;

	};

	DateTime.prototype.valueOf = function () {
		return this.getTimestamp();

	};

	DateTime.prototype.modify = function(s) {
		this._initialize();

        var t = this._.date.getTime(),
            parts, dt, i, o;

        if (s instanceof DateInterval) {
            this._.date = new Date(t + s.getLength());
            return this;

        }

        parts = DateTime.i18n.getParser(this._.locale).exec(s.toLowerCase());

        if (!parts) {
            throw new Error('Invalid interval expression: ' + s);
        }

        /**
         * Parts' indices:
         *  1: now
         *  2: yesterday
         *  3: today
         *  4: tomorrow
         *  5: first of
         *  6: last of
         *  7: last
         *  8: this
         *  9: next
         * 10: year
         * 11: month
         * 12: week
         * 13: last
         * 14: this
         * 15: next
         * 16-27: months
         * 28-34: weekdays
         * 35: noon
         * 36: midnight
         * 37: time
         * 38: relative offset
         */

        if (parts[1]) {
            t = Date.now();

        } else if (parts[2]) {
            t -= 86400000;

        } else if (parts[3]) {
            dt = new Date();
            dt.setHours(this._.date.getHours(), this._.date.getMinutes(), this._.date.getSeconds(), this._.date.getMilliseconds());
            t = dt.getTime();

        } else if (parts[4]) {
            t += 86400000;

        } else if (parts[5] || parts[6]) {
            dt = new Date(t);
            o = parts[7] ? -1 : (parts[9] ? 1 : 0);

            if (parts[10]) {
                dt.setFullYear(dt.getFullYear() + o, parts[5] ? 0 : 11, parts[5] ? 1 : 31);

            } else if (parts[11]) {
                dt.setMonth(dt.getMonth() + o, parts[5] ? 1 : DateTime.getDaysInMonth(dt.getMonth() + o, dt.getFullYear()));

            } else { // parts[12]
                dt.setDate(dt.getDate() - dt.getDay() + DateTime.i18n.getWeekStart(this._.locale) + o * 7 + (parts[5] ? 0 : 6));

            }

            t = dt.getTime();

        } else if (parts[13] || parts[14] || parts[15]) {
            dt = new Date(t);
            o = parts[13] ? -1 : (parts[15] ? 1 : 0);

            for (i = 16; i < 35; i++) {
                if (parts[i]) {
                    break;
                }
            }

            if (i < 28) {
                i -= 16;
                dt.setMonth(o * 12 + i, 1);

            } else {
                i -= 28;

                if (i < DateTime.i18n.getWeekStart(this._.locale)) {
                    i += 7;
                }

                dt.setDate(dt.getDate() - dt.getDay() + o * 7 + i);

            }

            t = dt.getTime();

        }

        if (parts[35] || parts[36]) {
            dt = new Date(t);
            dt.setHours(parts[36] ? 0 : 12, 0, 0, 0);
            t = dt.getTime();

        } else if (parts[37]) {
            dt = new Date(t);
            o = parts[37].match(/^(\d+)(?::(\d+)(?::(\d+))?)?\s*([ap]m)?/i);
            o[1] = parseInt(o[1].replace(/^0(\d)$/, '$1'));

            if (o[1] === 12 && o[4] === 'am') {
                o[1] = 0;
            } else if (o[1] < 12 && o[4] === 'pm') {
                o[1] += 12;
            }

            o[2] = o[2] !== undefined ? parseInt(o[2].replace(/^0(\d)$/, '$1')) : 0;
            o[3] = o[3] !== undefined ? parseInt(o[3].replace(/^0(\d)$/, '$1')) : 0;
            dt.setHours(o[1], o[2], o[3], 0);
            t = dt.getTime();

        }

        if (parts[38]) {
            t += DateInterval.from(parts[38], this._.locale).getLength();
        }

        this._.date = new Date(t);
        return this;

	};

	DateTime.prototype.modifyClone = function(s) {
		return DateTime.from(this).modify(s);

	};

	DateTime.prototype._initialize = function() {
		if (this._.initialized) {
			return;

		}

		this._.initialized = true;

        var m, s;

		if (typeof this._.date === 'string') {
			if (m = this._.date.match(/^@(\d+)$/)) {
				this._.date = new Date(m[1] * 1000);

			} else if (m = this._.date.match(/^(\d\d\d\d-\d\d-\d\d)[ T](\d\d:\d\d(?::\d\d(?:\.\d+)?)?)([-+]\d\d:?\d\d)?$/)) {
				this._.date = new Date(m[1] + 'T' + m[2] + (m[3] || ''));

			} else if (DateTime.isModifyString(this._.date, this._.locale)) {
				s = this._.date;
				this._.date = new Date();
				this.modify(s);

			} else {
				this._.date = new Date(this._.date);

			}
		} else if (typeof this._.date === 'number') {
			this._.date = new Date(this._.date);

		} else if (DateTime.isDateObject(this._.date)) {
			s = this._.date.date;

			if (this._.date.timezone_type !== 3 || this._.date.timezone === 'UTC') {
				s += ' ' + this._.date.timezone;

			}

			this._.date = new Date(s);

		} else if (this._.date instanceof DateTime) {
		    this._.locale = this._.date.getLocale();
			this._.date = new Date(this._.date.getTime());

		}
	};

    _context.register(DateTime, 'DateTime');

});

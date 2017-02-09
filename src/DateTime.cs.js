_context.invoke('Utils', function (DateTime) {

    DateTime.i18n.locales.cs = {
        getPlural: function(n) { return n === 1 ? 0 : (n > 1 && n < 5 ? 1 : 2); },
        weekStart: 1,
        keywords: {
            weekdays: {
                abbrev: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
                full: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota']
            },
            months: {
                abbrev: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čer', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
                full: ['Ledna', 'Února', 'Března', 'Dubna', 'Května', 'Června', 'Července', 'Srpna', 'Září', 'Října', 'Listopadu', 'Prosince']
            },
            intervals: {
                year: ['rok', 'roky', 'let'],
                month: ['měsíc', 'měsíce', 'měsíců'],
                week: ['týden', 'týdny', 'týdnů'],
                day: ['den', 'dny', 'dnů'],
                hour: ['hodinu', 'hodiny', 'hodin'],
                minute: ['minutu', 'minuty', 'minut'],
                second: ['sekundu', 'sekundy', 'sekund'],
                millisecond: ['milisekundu', 'milisekundy', 'milisekund']
            },
            conjuction: 'a'
        },
        parsers: {
            now: 'nyní',
            today: 'dnes',
            tomorrow: 'zítra',
            yesterday: 'včera',
            at: 'v',
            noon: 'poledne',
            midnight: 'o\\s+půlnoci',
            last: 'minul(?:ý|ého|é|á|ou)',
            'this': 'tento|tuto|tato|toto|tohoto',
            next: 'příští(?:ho)?',
            firstOf: 'první(?:ho|\\s+den)?',
            lastOf: 'poslední(?:ho|\\s+den)?',
            year: 'roku',
            month: 'měsíce',
            week: 'týdne',
            months: ['led(?:en|na)?', 'úno(?:ra?)?', 'bře(?:zen|zna)?', 'dub(?:en|na)?', 'kvě(?:ten|tna)?', 'čer(?:ven(?!ec)|vna)?', 'červen(?:ec|ce)|čvc', 'srp(?:en|na)?', 'září?', 'říj(?:en|na)?', 'lis(?:topadu?)?', 'pro(?:sinec|since)?'],
            weekdays: ['ne(?:děl[ei])?', 'po(?:ndělí)?', 'út(?:erý)?', 'st(?:řed[au])?', 'čt(?:vrtek)?', 'pá(?:tek)?', 'so(?:bot[au])?'],
            intervals: {
                year: 'r(?:oky?)?|let',
                month: 'měs(?:íc[eů]?)?',
                week: 't(?:ýden|ýdn[yů])?',
                day: 'd(?:en|n[yů]?)?',
                hour: 'h(?:odin[ay]?)?',
                minute: 'min(?:ut[ay]?)?',
                second: 's(?:ek(?:und[ay]?)?)?',
                millisecond: 'milisekund[ay]?|ms'
            }
        }
    };

});

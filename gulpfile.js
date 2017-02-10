var gulp = require('gulp'),
    jasmineBrowser = require('gulp-jasmine-browser');

function getNittroFiles(pkg) {
    return require('./node_modules/' + pkg + '/nittro.json').files.js.map(function (file) {
        return './node_modules/' + pkg + '/' + file;
    });
}

var files = [
        'node_modules/promiz/promiz.js'
    ].concat(getNittroFiles('nittro-core'))
    .concat(require('./nittro.json').files.js)
    .concat('tests/specs/**.spec.js');

gulp.task('test', function () {
    return gulp.src(files)
        .pipe(jasmineBrowser.specRunner({console: true}))
        .pipe(jasmineBrowser.headless());
});

gulp.task('default', ['test']);

'use strict';

var path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del');

var aliases = {};

/**
 * Will look for .scss|sass files inside the node_modules folder
 */
function npmModule(url, file, done) {
    // check if the path was already found and cached
    if(aliases[url]) {
      return done({ file:aliases[url] });
    }
  
    // look for modules installed through npm
    try {
      var newPath = path.relative('./', require.resolve(url));
      aliases[url] = newPath; // cache this request
      return done({ file:newPath });
    } catch(e) {
      // if your module could not be found, just return the original url
      aliases[url] = url;
      return done({ file:url });
    }
}

gulp.task('styles', () => {
    return gulp.src('./src/Views/Resources/sass/**/*.scss')
        .pipe(sass({ importer:npmModule }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css/'));
});


gulp.task('clean', () => {
    return del([
        './public/css/main.css',
    ], {force: true});
});

gulp.task('default', gulp.series(['clean', 'styles']));

gulp.task('watch', () => {
    gulp.watch('./src/Views/Resources/sass/**/*.scss', (done) => {
        gulp.series(['clean', 'styles'])(done);
    });
});
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
    rename = require('gulp-rename');

// Lint JS
gulp.task('lint', function() {
  gulp.src('./src/*.js')
    .pipe(jshint({'latedef':'nofunc'}))
    .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify', function(){
    gulp.src('./src/*.js')
        .pipe(concat('asker.js'))
        .pipe(gulp.dest('lib'))
        .pipe(rename('asker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('lib'));
});

// Default
gulp.task('default', ['lint','minify'] );




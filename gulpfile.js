var gulp = require('gulp'),
   uglify = require('gulp-uglify'),
   copy = require('gulp-copy'),
   compass = require('gulp-compass'),
   del = require('del'),
   concat = require('gulp-concat');

var libJsSrc = "source/scripts/lib/";
var dataJsSrc = "source/scripts/data/";
var appJsSrc = "source/scripts/app/";

var scssSrc = "source/scss/";
var fontSrc = "source/fonts/";

gulp.task('clean', ['cleanLibJs', 'cleanDataJs', 'cleanAppJs', 'cleanScss', 'cleanFonts']);

gulp.task('buildLibJs', function () {
    gulp.src([libJsSrc + 'jquery-2.1.1.min.js', libJsSrc + '*'])
        //.pipe(uglify())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('build/scripts/'))
});

gulp.task('cleanLibJs', function (cb) {
  del([
    'build/scripts/libs.js'
  ], cb);
});

gulp.task('buildDataJs', function () {
    gulp.src([dataJsSrc + '*'])
        //.pipe(uglify())
        .pipe(concat('data.js'))
        .pipe(gulp.dest('build/scripts/'))
});

gulp.task('cleanDataJs', function (cb) {
  del([
    'build/scripts/data.js'
  ], cb);
});

gulp.task('buildAppJs', function () {
    gulp.src([appJsSrc + '*'])
        //.pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/scripts/'))
});

gulp.task('cleanAppJs', function (cb) {
  del([
    'build/scripts/app.js'
  ], cb);
});


gulp.task('buildScss', function () {
  gulp.src(scssSrc + '*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'build/css',
      sass: 'source/scss'
    }))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('cleanScss', function (cb) {
  del([
    'build/css/*'
  ], cb);
});

gulp.task('buildFonts', function () {
    gulp.src([fontSrc + '*'])
        .pipe(gulp.dest('build/fonts/'))
});

gulp.task('cleanFonts', function (cb) {
  del([
    'build/fonts/*'
  ], cb);
});

gulp.task('startWatching', function () {
    gulp.watch(libJsSrc + '*', ['cleanLibJs','buildLibJs']);
    gulp.watch(dataJsSrc + '*', ['cleanDataJs','buildDataJs']);
    gulp.watch(appJsSrc + '*', ['cleanAppJs','buildAppJs']);
    gulp.watch(scssSrc + '*', ['cleanScss','buildScss']);
    gulp.watch(fontSrc + '*', ['buildFonts','cleanFonts']);
});

gulp.task('watch', ['clean', 'build', 'startWatching']);

gulp.task('build', ['clean', 'buildLibJs', 'buildDataJs', 'buildAppJs', 'buildScss', 'buildFonts']);
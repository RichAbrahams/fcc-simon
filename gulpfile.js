var gulp = require('gulp');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var lost = require('lost');
var rucksack = require('rucksack-css');
var poststylus = require('poststylus');
var browserSync = require('browser-sync');

gulp.task('styles', function() {
  var processors = [autoprefixer, lost, rucksack];
  return gulp.src('./css/styles.styl')
    .pipe(stylus({'include css': true}))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./css'));
});

gulp.task('reload', function() {
  browserSync.reload({stream: false});
  console.log('***RELOAD***');
  });

gulp.task('default', function() {
  browserSync.init({server: {baseDir: './'}});
  gulp.watch(['**/*.styl','*.html','js/*.js'], ['styles','reload']);
});

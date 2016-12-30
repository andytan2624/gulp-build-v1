"use strict";

var gulp = require('gulp'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    uglify = require('gulp-uglify'),
    maps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint')
    ;

var options = {
    src: '.',
    dist: 'dist'
};

gulp.task('scripts', function() {
    return gulp.src(options.src + '/index.html')
        .pipe(useref())
        .pipe(iff('*.js', eslint({configFile: options.src + '/js/eslint.json'})))
        .pipe(iff('*.js', eslint.format()))
        .pipe(iff('*.js', eslint.failAfterError()))
        .pipe(maps.init())
        .pipe(iff('*.js', uglify()))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist));
});

gulp.task('styles', function() {
    return gulp.src(options.src + '/sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/css'))
});

gulp.task('images', function(){
    gulp.src(options.src + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'))
});

gulp.task('clean', function() {
    del(['dist'])
});

gulp.task('build', ['clean'], function() {
    gulp.start('scripts');
    gulp.start('styles');
    gulp.start('images');
    gulp.src(options.src + '/icons/*')
        .pipe(gulp.dest(options.dist + '/icons' ))
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});
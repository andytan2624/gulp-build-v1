"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    iff = require('gulp-if'),
    uglify = require('gulp-uglify'),
    maps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint'),
    server = require('gulp-server-livereload')
    ;

var options = {
    src: '.',
    dist: 'dist'
};

gulp.task('scripts', function () {
    return gulp.src(['js/global.js', 'js/circle/circle.js', 'js/circle/autogrow.js'])
        .pipe(maps.init())
        .pipe(concat('all.js'))
        .pipe(iff('*.js', eslint({configFile: options.src + '/js/eslint.json'})))
        .pipe(iff('*.js', eslint.format()))
        .pipe(iff('*.js', eslint.failAfterError()))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/js'));
});

gulp.task('styles', function () {
    return gulp.src(options.src + '/sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/css'))
});

gulp.task('watch', function () {
    gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['styles']);
    gulp.watch(['js/global.js', 'js/circle/circle.js', 'js/circle/autogrow.js'], ['scripts']);
});

gulp.task('images', function () {
    gulp.src(options.src + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'))
});

gulp.task('clean', function () {
    del(['dist'])
});

gulp.task('serve', function () {
    gulp.start('watch');
    gulp.src('dist')
        .pipe(server({
            defaultFile: 'index.html',
            livereload: true,
            directoryListing: false,
            open: true,
            log: 'debug',
            clientConsole: true
        }));
});

gulp.task('build', ['clean'], function () {
    gulp.start('scripts');
    gulp.start('styles');
    gulp.start('images');
    gulp.src(options.src + '/icons/*')
        .pipe(gulp.dest(options.dist + '/icons'));
    gulp.src(options.src + '/index.html')
        .pipe(gulp.dest(options.dist));
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
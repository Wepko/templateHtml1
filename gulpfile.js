const {src, dest, series, watch} = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const sync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const include = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');

function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('built'))
}

function style() {
    return src('src/sass/**.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(concat('style.min.css'))
        .pipe(dest('built/css/'))
}

function img() {
    return src('src/img/**/*.{png,jpg,jpeg,webp,raw}')
        .pipe(dest('built/img'))
}

function script() {
    return src('src/js/**.js')
        .pipe(concat('scripts.min.js'))
        .pipe(dest('built/js'))
}

function fonts() {
    return src('src/fonts/**')
        .pipe(dest('built/fonts'))
}


function clear() {
    return del('built')
}

function serve() {
    sync.init({
        server: './built'
    });

    watch('src/js/**.js', series(script)).on('change', sync.reload)
    watch('src/sass/**.sass', series(style)).on('change', sync.reload)
    watch('src/**.html', series(html)).on('change', sync.reload);
}

exports.style = style
exports.default = series(clear, html, style, img, script, fonts, serve)
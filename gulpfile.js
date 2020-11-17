const gulp = require('gulp');
const order = require('gulp-order');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
const sourcemaps = require('gulp-sourcemaps');
// const htmlPartial = require('gulp-html-partial');
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
const clean = require('gulp-clean');
const isProd = process.env.NODE_ENV === 'prod';

// const htmlFile = [
//     'src/pages/*.html'
// ]

function html() {
    return gulp.src("src/pages/**/*.ejs")
        .pipe(ejs({ title: 'gulp-ejs' }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('dist'));
}

// function htmlejs() {
//     return gulp.src("src/templates/**/*.ejs")
//         .pipe(ejs({}))
// }

// function html() {
//     return gulp.src(htmlFile)
//         .pipe(htmlPartial({
//             basePath: 'src/pages/partials/'
//         }))
//         .pipe(gulpIf(isProd, htmlmin({
//             collapseWhitespace: true
//         })))
//         .pipe(gulp.dest('dist'));
// }

function css() {
    return gulp.src('src/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('dist/css/'));
}

function modules() {
    return gulp.src('src/modules/**/*.js')
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('dist/js/modules'));
}

function js() {
    return gulp.src('src/js/vendors/**/*.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('dist/js'));
}

function scripts() {
    return gulp.src('src/js/script.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('dist/js'));
}

function jsmaps() {
    return gulp.src('src/js/vendors/*.map')
        // .pipe(jsImport({
        //     hideConsole: true
        // }))
        // .pipe(concat('bundle.map'))
        // .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('dist/js'));
}

function json() {
    return gulp.src('src/data/**/*.json')
        .pipe(gulp.dest('dist/js'));
}

function jsdata() {
    return gulp.src('src/data/**/*.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('data.js'))
        .pipe(gulp.dest('dist/js'));
}

function docs() {
    return gulp.src('src/docs/**/*')
        .pipe(gulp.dest('dist/docs'));
}

function img() {
    return gulp.src('src/img/**/*')
        .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('dist/img'));
}

function fonts() {
    return gulp.src('src/fonts/**/*')
        // .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('dist/fonts'));
}

function videos() {
    return gulp.src('src/videos/**/*')
        // .pipe(gulpIf(isProd, imagemin()))
        .pipe(gulp.dest('dist/videos'));
}

function serve() {
    browserSync.init({
        open: true,
        server: './dist'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('src/**/*.ejs', gulp.series(html, browserSyncReload));
    gulp.watch('src/docs/**/*', gulp.series(docs, browserSyncReload));
    gulp.watch('src/**/*.scss', gulp.series(css, browserSyncReload));
    gulp.watch('src/**/*.js', gulp.series(js, scripts, modules, browserSyncReload));
    gulp.watch('src/data/**/*.json', gulp.series(json, browserSyncReload));
    gulp.watch('src/images/**/*.*', gulp.series(img));
    gulp.watch('src/fonts/**/*.*', gulp.series(fonts));
    gulp.watch('src/videos/**/*.*', gulp.series(videos));
    gulp.watch('src/data/*.js', gulp.series(jsdata));
    return;
}

function del() {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
}

exports.css = css;
exports.html = html;
// exports.htmlejs = htmlejs;
exports.js = js;
exports.scripts = scripts;
exports.modules = modules;
exports.jsmaps = jsmaps;
exports.jsdata = jsdata;
exports.fonts = fonts;
exports.docs = docs;
exports.del = del;
exports.build = gulp.parallel(del, html, css, js, scripts, modules, jsmaps, jsdata, json, img, fonts, videos, docs);
exports.serve = gulp.parallel(html, css, js, scripts, modules, jsmaps, jsdata, json, img, fonts, videos, docs, watchFiles, serve);
exports.default = gulp.series(del, html, css, js, scripts, modules, jsmaps, jsdata, json, img, fonts, videos, docs);
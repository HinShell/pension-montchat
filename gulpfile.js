const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-clean-css');
const include = require('gulp-html-tag-include');
const randomStr = require('randomstring');
const replace = require('gulp-replace');
const sass = (require('gulp-sass'))(require('sass'));
const concat = require('gulp-concat');

gulp.task('delete-dist-folder', () => {
    return del('./dist', {force:true});
});

gulp.task('delete-tmp-folder', () => {
    return del('./src/tmp', {force:true});
});

gulp.task('copy-img', () => {
    return gulp.src('./src/assets/images/**/*')
    .pipe(gulp.dest('./dist/assets/images'));
});

gulp.task('copy-fonts', ()=> {
    return gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('copy-robot', ()=> {
    return gulp.src('./src/robots.txt')
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify-html', () => {
    return gulp.src('./src/tmp/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('template', () => {
    return gulp.src('./src/index.html')
    .pipe(include())
    .pipe(gulp.dest('./src/tmp'))
});

gulp.task('cache-css-random', () =>{
    var randomNumber = Math.floor(Math.random() * 6) +5;
    var randomString = randomStr.generate(randomNumber);
    return gulp.src('./src/tmp/index.html')
    .pipe(replace('main.css', 'main.css?' + randomString))
    .pipe(gulp.dest('./src/tmp'))
});

gulp.task('cache-font-random', () => {
    var randomNumber = Math.floor(Math.random() * 6) +5;
    var randomString = randomStr.generate(randomNumber);
    return gulp.src('./src/assets/css/fonts.css')
    .pipe(replace('icomoon.eot', 'icomoon.eot?' + randomString))
    .pipe(replace('icomoon.ttf', 'icomoon.ttf?' + randomString))
    .pipe(replace('icomoon.woff', 'icomoon.woff?' + randomString))
    .pipe(replace('icomoon.svg', 'icomoon.svg?' + randomString))
    .pipe(gulp.dest('./src/tmp'))
});

gulp.task('process-scss', () => {
    return gulp.src('./src/assets/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./src/tmp'));
});

gulp.task('bulma-css', () => {
    return gulp.src('./node_modules/bulma/css/bulma.min.css')
    .pipe(gulp.dest('./src/tmp/'))
});

gulp.task('minify-fonts-css', () => {
    return gulp.src('./src/tmp/fonts.css')
    .pipe(minify())
    .pipe(gulp.dest('./src/tmp'))
});

gulp.task('concat-css', () => {
    return gulp.src(['./src/tmp/bulma.min.css', './src/tmp/fonts.css', './src/tmp/main.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/assets/css/'))
});

// ---------------------

gulp.task('clean', 
    gulp.series(
        'delete-dist-folder',
        'delete-tmp-folder'
    )  
);

gulp.task('index', 
    gulp.series(
        'template',
        'cache-css-random',
        'minify-html'
    )
);

gulp.task('css',
    gulp.series(
        'process-scss',
        'cache-font-random',
        'bulma-css',
        'minify-fonts-css',
        'concat-css'  
    )
);

gulp.task('build', 
    gulp.series(
        'clean',
        'copy-img',
        'copy-fonts',
        'copy-robot',
        'css',
        'index'
    )
);
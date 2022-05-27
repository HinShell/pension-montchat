const {
    src,
    dest,
    parallel,
    series,
    watch,
    task
} = require('gulp')

const imgwebp = require('gulp-webp');
const minify = require('gulp-clean-css');
const include = require('gulp-html-tag-include');
const htmlmin = require('gulp-htmlmin');
const sass = (require('gulp-sass'))(require('sass'));
const concat = require('gulp-concat');
const del = require('del');
const rename = require('gulp-rename');
const randomStr = require('randomstring');
const replace = require('gulp-replace');

function deleteDistFolder() {
    return del(['./dist']);
}
function deleteTmpFolder() {
    return del('./src/tmp');
}
function minifyHtml() {
    return src('./src/tmp/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./dist'));
}
function processScss() {
    return src('./src/assets/scss/main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(dest('./src/tmp'));
}
function htmlTemplate() {
    return src('./src/index.html')
        .pipe(include())
        .pipe(dest('./src/tmp'))
}
function copyImg() {
    return src('./src/assets/images/**/*')
        .pipe(dest('./dist/assets/images'))
}
function copyFonts() {
    return src('./src/assets/fonts/**/*')
        .pipe(dest('./dist/assets/fonts'))
}
function copyRobots() {
    return src('./src/robots.txt')
        .pipe(dest('./dist'))
}
function installBulma() {
    return src('./node_modules/bulma/css/bulma.min.css')
        .pipe(dest('./src/tmp/'))
}
function concatCss() {
    return src(['./src/tmp/bulma.min.css', './src/tmp/fonts.css', './src/tmp/main.css'])
        .pipe(concat('main.css'))
        .pipe(dest('./dist/assets/css/'));
};
function minifyCss() {
    return src('./src/tmp/fonts.css')
        .pipe(minify())
        .pipe(dest('./src/tmp'))
}
function imagesWebp() {
    return src(['./src'+'/assets/images/*.{gif,png,jpg}'])
        .pipe(imgwebp({lossless: true}))
        .pipe(rename({extname: '.png.webp'}))
        .pipe(dest('./dist/assets/images'))

}
function clearCssCache() {
    var randomNumber = Math.floor(Math.random() * 6) + 5;
    var randomString = randomStr.generate(randomNumber);
    return src('./src/tmp/index.html')
        .pipe(replace('main.css', 'main.css?' + randomString))
        .pipe(dest('./src/tmp'))
}

function clearFontCache() {
    var randomNumber = Math.floor(Math.random() * 6) + 5;
    var randomString = randomStr.generate(randomNumber);
    return src('./src/assets/css/fonts.css')
        .pipe(replace('icomoon.eot', 'icomoon.eot?' + randomString))
        .pipe(replace('icomoon.ttf', 'icomoon.ttf?' + randomString))
        .pipe(replace('icomoon.woff', 'icomoon.woff?' + randomString))
        .pipe(replace('icomoon.svg', 'icomoon.svg?' + randomString))
        .pipe(dest('./src/tmp'))
}

exports.default =   task(deleteDistFolder)
                    task(minifyHtml)
                    task(processScss)
                    task(htmlTemplate)
                    task(copyImg)
                    task(concatCss)
                    task(deleteTmpFolder)
                    task(copyFonts)
                    task(copyRobots)
                    task(minifyCss)
                    task(imagesWebp)
                    task(clearCssCache)
                    task(installBulma)
                    task(clearFontCache)
exports.build =     series(deleteDistFolder, htmlTemplate, clearCssCache, clearFontCache, minifyHtml, minifyCss, processScss, installBulma, concatCss, imagesWebp, copyImg, copyFonts, copyRobots, deleteTmpFolder) 
exports.clean =     series(deleteDistFolder, deleteTmpFolder)
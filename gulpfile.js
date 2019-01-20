const gulp = require("gulp");
const sass = require("gulp-sass");
const cssmin = require("gulp-cssmin");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const mainBowerFiles = require('main-bower-files');
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const notify = require("gulp-notify");


const browserSync = require("browser-sync");
const reload = browserSync.reload;

gulp.task("styles", () => {
  gulp.src("src/css/main.scss")
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({suffix:".min"}))
    .pipe(gulp.dest("build/styles"))
    .pipe(reload({stream:true}))
});

gulp.task('lint', () => {
  return gulp.src('src/scripts/**/*.js').pipe(eslint({
    }))
  .pipe(eslint.format('stylish'))
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});

gulp.task("scripts", () => {
  browserify("src/scripts/main.js")
    .transform("babelify", {
      presets:["es2015"]
    })
    .bundle()
    .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 😱'
        }))
    .pipe(source("src/scripts/main.js"))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(rename({suffix:".min"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/scripts/"))
    .pipe(reload({stream:true}))
});

gulp.task("imageminification", () => {
  gulp.src("src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/images"))
});

gulp.task("watch", () => {
  gulp.watch("src/scripts/**/*.js", ["lint", "scripts"]);
  gulp.watch("src/css/**/*.scss", ["styles"]);
});

gulp.task("browser-sync", () => {
  browserSync({
    port: 8000,
    server: {
      baseDir:"."
    }
  });
});

gulp.task("default", ["lint","styles", "scripts", "imageminification", "watch", "browser-sync"]);
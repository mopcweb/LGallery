var gulp         = require('gulp'),
    browsersync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    del          = require('del'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-sass'),
    postcss      = require('gulp-postcss'),
    cssnano      = require('cssnano'),
    autoprefixer = require('autoprefixer'),
    babel        = require('gulp-babel'),
    uglify       = require('gulp-uglifyjs'),
    plumber      = require("gulp-plumber"),
    notify       = require('gulp-notify');

/* -------------- */
/* BrowserSync
/* -------------- */

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "app"
    },
    notify: false,
    open: false
  });
  done();
};

function browserSyncReload(done) {
  browsersync.reload();
  done();
};

/* -------------- */
/* CSS
/* -------------- */

function compileCss() {
  return gulp
    .src("app/sass/**/*.sass")
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest("app/css/unmin"))
    .pipe(postcss([ autoprefixer() ]));
};

function concatCss() {
  return gulp
    .src([
      'app/css/unmin/demo.css',
      'app/css/unmin/normalize.css',
    ])
    .pipe(plumber())
    .pipe(concat({path: 'all.css'}))
    .pipe(gulp.dest('app/css/unmin'))
};

function minifyCss() {
  return gulp
    .src([
      'app/css/unmin/lgallery.css',
      'app/css/unmin/all.css'
    ])
    .pipe(plumber())
    .pipe(postcss([ cssnano() ]))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browsersync.stream());
};

/* -------------- */
/* JS
/* -------------- */

function compileJs(done) {
  return gulp
    .src('app/js/es6/*.js')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(babel())
    .pipe(gulp.dest("app/js"));
};

function minifyJs() {
  return gulp
    .src([
      'app/js/lgallery.js'
    ])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/js'))
    .pipe(browsersync.stream());
};

/* -------------- */
/* Watch
/* -------------- */

function watchGulp() {
    gulp.watch('app/sass/*.sass', gulp.series(compileCss, concatCss, minifyCss));
    gulp.watch('app/js/es6/*.js', gulp.series(compileJs, minifyJs));
    gulp.watch('app/*.html', gulp.series(browserSyncReload));
};


/* -------------- */
/* Build
/* -------------- */

function clean() {
  return del('dist');
};

function build(done) {
  var buildCss = gulp
    .src([
      'app/css/lgallery.min.css',
      'app/css/all.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildImgs = gulp
    .src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));

  var buildJs = gulp
    .src([
      'app/js/lgallery.min.js'
    ])
    .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.
    src('app/*.html')
    .pipe(gulp.dest('dist'));

  done()
};

/* -------------- */
/* Default
/* -------------- */

gulp.task('default', gulp.parallel(watchGulp, browserSync))

/* -------------- */
/* Tasks
/* -------------- */

gulp.task('css', gulp.series(compileCss, concatCss, minifyCss));
gulp.task('js', gulp.series(compileJs, minifyJs));
gulp.task('clean', clean);
gulp.task('build', gulp.series(clean, 'css', 'js', build));

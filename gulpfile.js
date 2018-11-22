var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),
    babel        = require('gulp-babel');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false, // Отключаем уведомления
        open: false
    });
});

/* CSS tasks */

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css/normal')); // Выгружаем результата в папку app/css
        // .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('css-concat',['sass'] , function() {
    return gulp.src([
      'app/css/normal/main.css',
    ])
    .pipe(concat('lgallery.css')) // Название нового общего файла
    .pipe(gulp.dest('app/css/normal'));
    // .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('css-libs', ['css-concat'], function() {
    return gulp.src([
      'app/css/normal/lgallery.css',
      'app/css/normal/demo.css'
    ]) // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    .pipe(gulp.dest('app/css')) // Выгружаем в папку app/css
    .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

/* JS tasks */

gulp.task('scripts-es6', function () {
  return gulp.src('app/js/es6/*.js')
    .pipe(babel())
    .pipe(gulp.dest("app/js"));
    // .pipe(browserSync.reload({stream: true})); // Обновляем JS на странице при изменении;
});

gulp.task('scripts-ugly',['scripts-es6'] , function() {
    return gulp.src([
      'app/js/lgallery.js'
    ])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true})); // Обновляем JS на странице при изменении;
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

/* WATCH task */

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'scripts-es6'], function() {
    gulp.watch('app/sass/**/*.sass', ['css-libs']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/js/es6/*.js', ['scripts-ugly']);
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

/* BUILD task */

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'css-libs', 'scripts', 'scripts-ugly'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/lgallery.min.css',
        'app/css/demo.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src([
      'app/js/lgallery.min.js'
    ]) // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

/* DEFAULT tasks */

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);

const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      maps         = require('gulp-sourcemaps'),
      concat       = require('gulp-concat'),
      uglify       = require('gulp-uglify'),
      cssnano      = require('gulp-cssnano'),
      rename       = require('gulp-rename'),
      del          = require('del'),
      imagemin     = require('gulp-imagemin'),
      pngquant     = require('imagemin-pngquant'),
      cache        = require('gulp-cache'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync  = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(maps.init())
//    .pipe(autoprefixer(['last 3 versions', '> 1%', 'ie 9'], {cascade: true}))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});


//gulp.task('scripts', function() {
//   return gulp.src([
//       'libs/jquery/dist/jquery.min.js',
//       'libs/magnific-popup/dist/jquery.magnific-popup.min.js'
//   ])
//    .pipe(concat('libs.min.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('js'));
//});

//gulp.task('css-libs', ['sass'], function() {
//    return gulp.src('css/libs.css')
//    .pipe(cssnano())
//    .pipe(rename({suffix: ".min"}))
//    .pipe(gulp.dest('css'));
//});

// local server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }, 
        notify: false
    });    
});

//remove dist folder
gulp.task('clean', function() {
    return del.sync('dist');
});

//clear cache
gulp.task('clear-cache', function() {
    return cache.clearAll();
});

//image compressing
gulp.task('img-compress', function() {
    return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
       interlaced: true,
        progressive: true,
        svgoPlugins: {removeViewBox: false},
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

// watcher
gulp.task('watch', ['browser-sync', 'sass'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

//project building
gulp.task('build', ['clean', 'img-compress', 'sass'], function() {
    
    const buildCss = gulp.src(['src/css/main.css'])
        .pipe(gulp.dest('dist/css'));
    
    const buildFonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    
//    const buildJs = gulp.src('src/js/**/*.js')
//        .pipe(gulp.dest('dist/js'));
    
    const buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
    
});
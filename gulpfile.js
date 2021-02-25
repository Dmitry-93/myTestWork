const gulp = require('gulp');
const concat  = require('gulp-concat');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer  = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const gulpIF  = require('gulp-if');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries'); // объединяет медиа
const tildeImporter = require('node-sass-tilde-importer'); // для импорта normalize
const rigger = require('gulp-rigger'); // предназначен для подключения файлов
const smartGrid = require('smart-grid');
const path = require('path');


const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const imageminWebp = require('imagemin-webp');
const clone = require('gulp-clone');
const clonesink = clone.sink();
const babel = require('gulp-babel');


let isMap = process.argv.includes('--map');
let isClean = process.argv.includes('--clean');
let isSync = process.argv.includes('--sync');
let isCross = process.argv.includes('--cross'); // автопрефиксер
// let isGcmq = process.argv.includes('--media'); // объединение медиа
let isGcmq = false; // объединение медиа
let isTUNEL =  process.argv.includes('--tunel'); // тунель синка

//////////////////////////// Группы файлов ////////////////////////////


//////////////////////////// -- Группы файлов -- ////////////////////////////

//////////////////////////// Очистка ////////////////////////////

function clean(){
	return del('build/*');
}

//////////////////////////// -- Очистка -- ////////////////////////////

//////////////////////////// Перенос ////////////////////////////

//////// modules
function mod() {
	return gulp.src('./src/modules/**/*.*')
		.pipe(rigger())
		.pipe(gulp.dest('./build/modules'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}


//////// html
function html() {
	return gulp.src(['./src/**/*.html', './src/**/*.php'])
		.pipe(rigger())
		.pipe(gulp.dest('./build'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}



//////// img
function img() {
	return gulp.src('./src/img/**/*')
	// .pipe(imagemin([
  //   imagemin.gifsicle({interlaced: true}),
  //   imagemin.mozjpeg({quality: 75, progressive: true}),
  //   imagemin.optipng({optimizationLevel: 5}),
  //   imagemin.svgo({
  //       plugins: [
	// 				{removeViewBox: true},
	// 				{cleanupIDs: false}
  //       ]
	// 		})
	// 	]))
		// // .pipe($.cache($.imagemin())) // optimize images before converting
		// .pipe(clonesink) // start stream
		// .pipe(webp()) // convert images to webp and save a copy of the original format
		// .pipe(clonesink.tap()) // close stream and send both formats to dist
		.pipe(gulp.dest('./build/img'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}

//////// fonts
function fonts() {
	return gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./build/fonts'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}
//////////////////////////// -- Перенос -- ////////////////////////////

//////////////////////////// Компиляция CSS ////////////////////////////

function styles() {
	return gulp.src('./src/scss/main.scss')
		.pipe(gulpIF(isMap,sourcemaps.init()))
		.pipe(sass({
			importer: tildeImporter
		}).on('error', sass.logError))
		.pipe(gulpIF(isCross,autoprefixer()))
		// .pipe(gulpIF(isGcmq,gcmq()))
		.pipe(gulpIF(isClean,cleanCSS({
			level: 1
		})))
		.pipe(gulpIF(isMap,sourcemaps.write('.')))
		.pipe(gulp.dest('./build/css'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}

//////////////////////////// -- Компиляция CSS -- ////////////////////////////

//////////////////////////// Компиляция JS ////////////////////////////

function scripts() {
	return gulp.src('./src/js/main.js')
		.pipe(rigger())
		.pipe(gulpIF(isMap,sourcemaps.init()))
		.pipe(gulpIF(isClean,babel({
			presets: ['@babel/env']
			})))
		.pipe(concat('main.js'))
		// .pipe(gulpIF(isClean,uglify()))
		.pipe(gulpIF(isMap,sourcemaps.write()))
		.pipe(gulp.dest('./build/js'))
		.pipe(gulpIF(isSync,browserSync.stream()));
}

//////////////////////////// -- Компиляция JS -- ////////////////////////////
function grid (done){
	delete require.cache[path.resolve('./smartgrid.js')];
	let options = require('./smartgrid.js');
	smartGrid('./src/scss', options);
	done();
}



//////////////////////////// Наблюдение ////////////////////////////

function watch() {
	if (isSync) {
		browserSync.init({
			proxy: "ht.com",
			notify: false
		});
	}
	gulp.watch('./src/scss/**/*.scss', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/img/**/*', img);
	gulp.watch('./src/**/*.html', html);
	gulp.watch('./src/**/*.php', html);
	gulp.watch('./src/modules/**/*.*', mod);
	gulp.watch('./smartgrid.js', grid);
  //gulp.watch("./**/*.html").on('change', browserSync.reload);
  //gulp.watch("./**/*.php").on('change', browserSync.reload);
}

//////////////////////////// -- Наблюдение -- ////////////////////////////

//////////////////////////// Задачи ////////////////////////////


let build = gulp.parallel(html, styles, scripts, img, fonts, mod);
let buildWidhClean = gulp.series(clean, build);
let dev = gulp.series(buildWidhClean, watch);


gulp.task('grid', grid);
gulp.task('build', buildWidhClean);
gulp.task('watch', dev);

//////////////////////////// -- Задачи -- ////////////////////////////

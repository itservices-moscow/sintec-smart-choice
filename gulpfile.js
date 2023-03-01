import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import { htmlValidator } from 'gulp-w3c-html-validator';
import bemlinter from 'gulp-html-bemlinter';
import terser from 'gulp-terser';
import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import svgo from 'gulp-svgmin';
import { stacksvg } from 'gulp-stacksvg';
import { deleteAsync } from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, conservativeCollapse: true }))
    .pipe(gulp.dest('build'));
}

export const validateMarkup = () => {
	return gulp.src('build/*.html')
		.pipe(htmlValidator.analyzer())
		.pipe(htmlValidator.reporter({ throwErrors: true }));
}

export const lintBem = () => {
	return gulp.src('build/*.html')
		.pipe(bemlinter());
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
}

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(webp())
    .pipe(gulp.dest('build/img'));
}

// SVG

const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//Clean

const clean = () => {
  return deleteAsync('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html)).on('change', browser.reload);
}


// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    svg,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    svg,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);

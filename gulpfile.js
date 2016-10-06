'use strict';

const gulp = require('gulp'); // Gulp
const sass = require('gulp-sass'); // sass
const jade = require('gulp-jade'); // jade
const del = require('del'); // удаляем ненужное
const newer = require('gulp-newer'); // фиксирует есть ли новые файлы (обеспечивает скорейшую сборку)
const browserSync = require('browser-sync').create(); // livereload + синхронизация со всеми браузерами


gulp.task('sass', function(){ // sass компилятор
	return gulp.src('develop/css/styles.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('production/css'));
});


gulp.task('jade', function(){ // jade компилятор
	return gulp.src('develop/jade/**/[^_]*.jade', {since: gulp.lastRun('jade')})
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest('production'));
});


gulp.task('clean', function(){ // удаляем папку из проекта
	return del('production');
});


gulp.task('assets', function(){ // копируем все вложенные файлы после очистки
	return gulp.src(['develop/**/*.*','!develop/jade/**/*.*'])
		.pipe(newer('production'))
		.pipe(gulp.dest('production'));
});


gulp.task('build', gulp.series( // билд удаления и сборки + копирование файлов
	'clean',
	gulp.parallel('sass', 'jade', 'assets'))
);


gulp.task('watch', function(){ // фиксируем изменения файлов
	gulp.watch('develop/css/**/*.*', gulp.series('sass'));
	gulp.watch('develop/jade/**/*.jade', gulp.series('jade'));
	gulp.watch('develop/**/*.*', gulp.series('assets'));
});


gulp.task('serve', function(){
	browserSync.init({
		server: 'production'
	});

	browserSync.watch('production/**/*.*').on('change', browserSync.reload);
});


gulp.task('default', // запускаем сборку gulp
	gulp.series('build', gulp.parallel('watch', 'serve'))
);
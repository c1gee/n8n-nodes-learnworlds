const { src, dest } = require('gulp');
const gulp = require('gulp');

gulp.task('build:icons', function() {
	return src('icons/**/*')
		.pipe(dest('dist/icons'));
});

gulp.task('default', gulp.series('build:icons')); 
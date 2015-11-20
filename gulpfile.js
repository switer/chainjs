'use strict';

var gulp = require('gulp')
var webpack = require('gulp-webpack')
var uglify = require('gulp-uglifyjs')
var header = require('gulp-header')
var meta = require('./package.json')
var watch = require('gulp-watch')

var banner = ['/**',
              '* Chainjs v${version}',
              '* http://github.com/switer/chainjs',
              '*',
              '* (c) 2015 ${author}',
              '* Released under the ${license} License.',
              '*/',
              ''].join('\n')
var bannerVars = { 
        version : meta.version,
        author: 'guankaishe',
        license: 'MIT'
    }

gulp.task('watch', function () {
    watch(['chain.js', 'lib/*.js'], function () {
        gulp.start('default')
    })
});

gulp.task('default', function() {
    return gulp.src('chain.js')
        .pipe(webpack({
            output: {
                library: 'Chain',
                libraryTarget: 'umd',
                filename: 'chain.js'
            }
        }))
        .pipe(header(banner, bannerVars))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify('chain.min.js', {
            mangle: true,
            compress: true
        }))
        .pipe(header(banner, bannerVars))
        .pipe(gulp.dest('dist/'))
});

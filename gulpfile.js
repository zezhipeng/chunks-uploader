'use strict';

var gulp = require('gulp')
var server  = require('gulp-live-server')
var gutil = require("gulp-util");
var webpack = require("webpack")
var webpackConfig = require("./webpack.config.js")

var express

gulp.task("webpack",function(callback){
  webpack(
    webpackConfig,
    function(err,stats){
      if(err) throw new gutil.PluginError("webpack",err)
      gutil.log("[webpack]",stats.toString({
      }))
      callback()
    }
  )
})
gulp.task('server', function() {
  express = server.new("bin/www")
})
gulp.task("restart",function(){
  express.start.bind(express)()
})
gulp.task("watch",function(){
  gulp.watch("app.js",function(){
    gulp.start("restart")
  })
  gulp.watch("routes/**/*.js",function(){
    gulp.start("restart")
  })
  gulp.watch("src/**/*.jsx",["webpack"])
})
gulp.task("default",["server","watch","restart"])

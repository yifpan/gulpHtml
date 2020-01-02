var gulp = require('gulp');
var babel = require('gulp-babel');//把es6语法解析成es5
var concat = require('gulp-concat');//合并
var uglify = require('gulp-uglify');//压缩
var rev = require('gulp-rev');//对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');//替换路径
var htmlmin = require('gulp-htmlmin'); //压缩html里面的js，css，去除空格
var del = require('del');//删除文件
var less = require('gulp-less')



//js压缩
var concat = require('gulp-concat');
var order = require("gulp-order");
gulp.task('js',function(){
    return gulp.src('./src/js/*.js')
    // .pipe(babel())
    .pipe(order([
        'jquery-1.11.3.min.js',
        'swiper.min.js',
        'index.js'
    ]))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(rev())
    .pipe(gulp.dest('./build/js'))
    .pipe(rev.manifest('rev-js-manifest.json'))
    .pipe(gulp.dest('./build/js'));
});


//css压缩
var autoprefix = require('gulp-autoprefixer');//兼容处理
var minifyCss = require('gulp-minify-css');//压缩
gulp.task('style',function(){
    return gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(autoprefix({
            overrideBrowserslist:["Android 4.1","iOS 7.1","Chrome > 31","ff > 31","ie >= 8"],
            grid: true
            }))
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(gulp.dest('./build/css'))
        .pipe(rev.manifest('rev-css-manifest.json'))
        .pipe(gulp.dest('./build/css'));
});


//icon
gulp.task('ico', function (){
    return gulp.src(['./src/*.ico'])  
    .pipe(gulp.dest('./build'));
})

//img
gulp.task('images', function (){
    return gulp.src(['./src/images/*.jpg','./src/images/*.png','./src/images/*.gif'])  
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('./build/images')) 
        .pipe(rev.manifest('rev-images-manifest.json'))//生成一个rev-manifest.json
        .pipe(gulp.dest('./build/images'));//将 rev-manifest.json 保存到 rev 目录内
});

//html压缩
gulp.task('html',function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: false,//压缩页面JS
        babel:true,
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src('./src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./build'))
});


gulp.task('revimg', function() {
    //css，主要是针对img替换
    return gulp.src(['./build/**/rev-images-manifest.json', './build/css/*.css'])
        .pipe(revCollector({
            replaceReved:true
        }))
        .pipe(gulp.dest('./build/css'));
});
gulp.task('revjs', function() {
    //css，主要是针对img替换
    return gulp.src(['./build/**/rev-images-manifest.json', './build/js/*.js'])
        .pipe(revCollector({
            replaceReved:true,
            dirReplacements:{
                '../images': '../build/images'
            }
         }))
        .pipe(gulp.dest('./build/js'));
});

//使用rev替换成md5文件名，这里包括html和css的资源文件也一起
gulp.task('rev', function() {
    //html，针对js,css,img
    return gulp.src(['./build/**/*.json', './build/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./build'));
});

//删除Build文件
gulp.task('clean', function () {
   return del([
        './build/**/',
    ]);
});


//执行多个任务gulp4的用法 gulp.series()串行，gulp.parallel()并行
gulp.task('default', gulp.series('clean', gulp.parallel('html','images','style','js','ico'),'revimg','revjs','rev',function(){
    
}))
var gulp = require("gulp");

var server = require("browser-sync");

var concat = require("gulp-concat");

var uglify = require("gulp-uglify");

var rename = require("gulp-rename");

var copy = require("gulp-contrib-copy");

var postcss = require("gulp-postcss");

var clean = require("gulp-contrib-clean");

var csso = require("gulp-csso");

var autoprefixer = require("autoprefixer");


gulp.task("minjs", function() {
  gulp.src("./js/src/*.js")
    .pipe(concat("main.js"))
    .pipe(gulp.dest("build/js/"))
    .pipe(rename("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/js/"))
});


gulp.task("copyJslib", function() {
  gulp.src("js/*.js")
  .pipe(copy())
  .pipe(gulp.dest("build/js"))
});



gulp.task("style", function(){
  gulp.src("css/style.css")
  .pipe(postcss([
    autoprefixer({browsers: [
      "last 1 version",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Opera versions",
      "last 2 Edge versions"            
    ]})
    
    
  ]))
  
  .pipe(gulp.dest("build/css"))
  .pipe(csso())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
  .pipe(server.reload({stream: true}));
});


gulp.task("copyHtml", function() {
  gulp.src("*.html")
  .pipe(copy())
  .pipe(gulp.dest("build"))
});

gulp.task("copyAssets", function() {
  gulp.src("./assets/**")
  .pipe(copy())
  .pipe(gulp.dest("build/assets"))
  gulp.src("./img/**")
  .pipe(copy())
  .pipe(gulp.dest("build/img"))
  gulp.src("./templates/**")
  .pipe(copy())
  .pipe(gulp.dest("build/templates"))
});

gulp.task("clean", function () {
  return gulp.src("build", {read: false})
    .pipe(clean());
});

gulp.task("show", function(){
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });
  
  
  gulp.watch("*.html", ["copyHtml"]).on("change", server.reload);
  gulp.watch("js/src/*.js", ["minjs"]).on("change", server.reload);
  gulp.watch("css/*.css", ["style"]).on("change", server.reload);
  
});

gulp.task("build", ["clean", "copyHtml", "copyAssets", "minjs", "copyJslib", "style"]);





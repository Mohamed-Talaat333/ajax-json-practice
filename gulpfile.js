// List of all browsers that considered when prefixing for css
const autoPrefixBrowserList = [
  "last 2 version",
  "safari 5",
  "opera 12.1",
  "ios 6",
  "android 4",
];

const {
  src,
  dest,
  task,
  watch,
  series,
  // parrallel
} = require("gulp");

const browserSync = require("browser-sync");
const minifyJs = require("gulp-minify");
const sass = require("gulp-sass")(require("node-sass")); // must install a sass compiler such as "node-sass" package for "gulp-sass" to work.
const sourceMaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const autoPrefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const fileinclude = require("gulp-file-include");
const remove = require("del");
// const image = require("gulp-image");
const gulpIf = require("gulp-if");
const flatMap = require("gulp-flatmap");
const replace = require("gulp-replace");
// var concat = require("gulp-concat");

/*******************************************
    Settings
*******************************************/

var env = process.env.NODE_ENV;
var baseDir = "app"; // main development folder
var outputDir = "dist"; // folder where all files and folders go after compiling
var htmlIncludesDir = "_html-includes"; // folder that contains common html files like header and footer
var isProd = false;

// setting environment to "prod" when running "npm run gulp-prod"
(function () {
  if (env == "prod") {
    outputDir = "prod";
    isProd = true;
  }
})();

// path to files where you watch and start your task process
var paths = {
  images: {
    input: `${baseDir}/assets/images/**/*`,
    output: `${outputDir}/assets/images`,
  },
  fonts: {
    input: `${baseDir}/assets/fonts/**/*`,
    output: `${outputDir}/assets/fonts`,
  },
  html: {
    input: [
      `${baseDir}/**/*.html`,
      `!${baseDir}/${htmlIncludesDir}`,
      `!${baseDir}/${htmlIncludesDir}/**/*`,
    ],
    watchInput: `${baseDir}/**/*.html`,
    output: outputDir,
  },
  styles: {
    input: [
      `${baseDir}/assets/styles/**/*`,
      `!${baseDir}/assets/styles/sass`,
      `!${baseDir}/assets/styles/sass/**/*`,
    ],
    watchInput: `${baseDir}/assets/styles/**/*`,
    output: `${outputDir}/assets/styles`,
  },
  scripts: {
    input: `${baseDir}/assets/scripts/**/*`,
    watchInput: `${baseDir}/assets/scripts/**/*`,
    output: `${outputDir}/assets/scripts`,
  },
};

/*******************************************
    Gulp tasks
*******************************************/

// initializing browser-sync server
function browser_sync() {
  browserSync({
    server: {
      baseDir: `${outputDir}/`, // folder where the server starts from
    },
    options: {
      reloadDelay: 250, // time between file save and reload
    },
    notify: false,
  });
}

// remove old (dist && prod) directories then start over, in case files got deleted or renamed while not watching
function removeOldFolders() {
  return remove(outputDir, { force: true });
}

// handling images
function images() {
  return (
    src(paths.images.input)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // Minify and compress only if in production environment
      // .pipe(gulpIf(isProd, image()))

      // Destination for the output
      .pipe(dest(paths.images.output))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

// handling fonts
function fonts() {
  return (
    src(paths.fonts.input)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // Destination for the output
      .pipe(dest(paths.fonts.output))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

// handling HTML files
function html() {
  return (
    src(paths.html.input)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // Including all HTML includes
      .pipe(
        fileinclude({
          prefix: "@",
          basepath: `${baseDir}/${htmlIncludesDir}`,
        })
      )

      .pipe(
        flatMap(function (stream, file) {
          // detecting operating system to determine whether to use forwardslash or backslash
          if (process.platform == "win32") {
            var route = "../".repeat(
              (file.path.split("app\\").pop().match(/\\/g) || []).length
            );
          } else {
            var route = "../".repeat(
              (file.path.split("app\\").pop().match(/\//g) || []).length
            );
          }

          // contents.files is an array
          return (
            stream

              .pipe(replace("$$/", route))

              // Destination for the output
              .pipe(dest(paths.html.output))
          );
        })
      )

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

// handling style(sass) files
function styles() {
  // the initializer / master SCSS file, which will just be a file that imports everything
  return (
    src(paths.styles.input)
      // prevent pipe breaking caused by errors from gulp plugins
      // .pipe(plumber())

      // Getting sourceMaps ready only if in development environment
      .pipe(gulpIf(!isProd, sourceMaps.init()))

      // Compiling SCSS files
      .pipe(sass().on("error", sass.logError))

      // Prefixing all styles to match cross browsers
      .pipe(
        autoPrefixer({
          cascade: true,
        })
      )

      // writing our sourceMaps only if in development environment
      .pipe(gulpIf(!isProd, sourceMaps.write("/")))

      // the final filename of our combined css file
      // .pipe(concat("style.css"))

      // minifying our css file/s only if in production environment
      .pipe(gulpIf(isProd, cleanCSS()))

      // destination for the output
      .pipe(dest(paths.styles.output))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

// handling javascript files
function scripts() {
  //this is where our dev JS js are
  return (
    src(paths.scripts.input)
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())

      // this is the filename of the compressed version of our JS
      // .pipe(concat("app.js"))

      // minifying our js file/s only if in production environment
      .pipe(
        gulpIf(
          isProd,
          minifyJs({
            ext: {
              src: ".js",
              min: ".js",
            },
            mangle: false,
            noSource: true,
            ignoreFiles: [".combo.js", ".min.js"],
          })
        )
      )

      // destination for the output
      .pipe(dest(paths.scripts.output))

      // reloading broswer(browser-sync) after any chage only if in development environment
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
}

// main watch function, and (starting && reloading) browser using browser_sync
function watch_files() {
  // watching files for each function
  watch(paths.images.input, images);
  watch(paths.fonts.input, fonts);
  watch(paths.html.watchInput, html);
  watch(paths.styles.watchInput, styles);
  watch(paths.scripts.watchInput, scripts);

  // handling (deleted && renamed) files or folders while running(watching)
  const mainWatcher = watch(`${baseDir}/**/*`);
  mainWatcher.on("all", function (event, path) {
    if (event == "unlink" || event == "unlinkDir") {
      if (process.platform == "win32") {
        var distPath = path.replace(`${baseDir}\\`, outputDir + "\\");
      } else {
        var distPath = path.replace(`${baseDir}/`, `${outputDir}/`);
      }
      remove(distPath, { force: true });
      console.log(`${path} was removed`);
      console.log(`${distPath} was removed`);
    }
  });

  // starting the development server on browser
  browser_sync();
}

// signal that "prod folder" is ready.
function prodFinished(done) {
  console.log('Your final "prod" folder is now ready');
  done();
}

// this is our main task when you run "gulp" in terminal
// run "gulp" for development, and run "npm run gulp-prod" for production
task(
  "default",
  series(
    removeOldFolders,
    images,
    fonts,
    html,
    styles,
    scripts,
    isProd ? prodFinished : watch_files
  )
);

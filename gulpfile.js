const {src, dest, parallel, task, watch, series} = require('gulp'),
    browserSync = require('browser-sync').create(),
    rimraf = require('rimraf'),
    twig = require('gulp-twig'),
    webpack = require('webpack-stream'),
    named = require('vinyl-named')
;

// const sass = require('gulp-sass');
// const spritesmith = require('gulp.spritesmith');
// const rename = require('gulp-rename');


/* -------- Paths ---------- */
const path = (function () {
    const baseDist = 'dist',
        baseSrc = './src';

    return {
        baseDist,
        baseSrc,
        fonts: {
            dest: baseDist + '/fonts',
            src: baseSrc + '/fonts/**/*.*',
        },
        images: {
            dest: baseDist + '/img',
            src: baseSrc + '/img/**/*.*',
        },
        templates: {
            dest: baseDist,
            src: baseSrc + '/*.twig'
        },
        js: {
            dest: baseDist + '/js',
            src: baseSrc + '/js/*.js'
        },
        watch: {
            dist: baseDist + '/**/*',
            src: baseSrc + '/**/*',
        }
    };
}());

// twig functions
const pathResolve = {
    images: '/images',
    asset: '/'
};
let twigFunc = [
    {
        name: "path",
        func: function (path) {
            'use strict';

            let namespace = '';
            let slashPosition = path.indexOf('/');
            if (path.charAt(0) === "@" && slashPosition > 0) {
                namespace = path.slice(1, slashPosition);
                path = path.slice(path.indexOf('/'))
            }

            if (namespace && pathResolve.hasOwnProperty(namespace)){
                return pathResolve[namespace] + path;
            }

            return path;
        }
    }
];


//region server
task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: path.baseDist
        }
    });
    watch(path.watch.dist).on('change', browserSync.reload);
});
//endregion

//region html
/* ------------ Html compile ------------- */
task('templates:compile', function buildHTML() {
    return src(path.templates.src)
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            },
            functions: twigFunc
        }))
        .pipe(dest(path.templates.dest))
});
//endregion

//region js
task('app:compile', function () {
    return src(path.js.src)
        .pipe(named())
        .pipe(webpack({
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: ['@babel/plugin-proposal-object-rest-spread']
                            }
                        }
                    },
                    {
                        test: /\.(scss|css)$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            {loader: "style-loader"},
                            {loader: "css-loader"},
                            {loader: "sass-loader"},
                        ],
                    },
                    {
                        test: /\.(jpeg|png|svg|jpg|gif)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: '../images',
                                    publicPath: 'images',
                                }
                            },
                        ],
                    },
                    {
                        test: /\.twig$/,
                        use: [
                            'twig-loader',
                            'extract-loader',
                            {
                                loader: 'html-loader',
                            },
                        ],
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: '../fonts',
                                    publicPath: 'fonts',
                                }
                            },
                        ],
                    },
                ],
            },
            devtool: 'source-map',
        }))
        .pipe(dest(path.js.dest));
});
//endregion

/* ------------ Styles compile ------------- */
/*
    !!!! styles should be injected through javascript with webpack. See main.js
 */

//region sprites
/* ------------ Sprite ------------- */
// task('sprite', function(cb) {
//     const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
//         imgName: 'sprite.png',
//         imgPath: '../images/sprite.png',
//         cssName: 'sprite.scss'
//     }));
//
//     spriteData.img.pipe(gulp.dest('build/images/'));
//     spriteData.css.pipe(gulp.dest('source/styles/global/'));
//     cb();
// });
//endregion

//region clean
task('clean', function del(cb) {
    return rimraf(path.baseDist, cb);
});
//endregion

/* ------------ Copy fonts ------------- */
task('copy:fonts', function () {
    return src(path.fonts.src).pipe(dest(path.fonts.dest));
});

/* ------------ Copy images ------------- */
task('copy:images', function () {
    return src(path.images.src).pipe(dest(path.images.dest));
});

/* ------------ Copy ------------- */
task('copy', parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
task('watch', function () {
    watch(path.watch.src, series(
        'templates:compile',
        'app:compile'
    ));
});

task('default', series(
    'clean',
    parallel('templates:compile', 'app:compile',/* 'sprite', 'copy'*/),
    parallel('watch', 'server'),
));
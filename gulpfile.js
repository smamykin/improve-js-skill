const {src, dest, parallel, task, watch, series} = require('gulp'),
    browserSync = require('browser-sync').create(),
    rimraf = require('rimraf'),// clean up dist directory.
    twig = require('gulp-twig'),// template rendering.
    webpack = require('webpack-stream'),//prepare js and css
    named = require('vinyl-named');// It helps to save given names of the files for their  using in the dist directory.


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
            dest: baseDist + '/images',
            src: baseSrc + '/images/**/*.*',
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
    asset: ''
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
/* !!! Styles should be injected through javascript with webpack. See main.js */

task('clean', function del(cb) {
    return rimraf(path.baseDist, cb);
});
task('copy:fonts', function () {
    return src(path.fonts.src).pipe(dest(path.fonts.dest));
});
task('copy:images', function () {
    return src(path.images.src).pipe(dest(path.images.dest));
});
task('copy', parallel('copy:fonts', 'copy:images'));
task('watch', function () {
    watch(path.watch.src, series(
        'templates:compile',
        'app:compile'
    ));
});
task('default', series(
    'clean',
    parallel('templates:compile', 'app:compile',/* 'sprite',*/ 'copy'),
    parallel('watch', 'server'),
));
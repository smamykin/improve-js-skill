const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');


module.exports = {
    mode: "development",
    entry: {
        app:[
            '@babel/polyfill',
            "./src/app.js",
        ],
        main_page: [
            '@babel/polyfill',
            "./src/js/main_page.js",
        ],
        people_list: [
            '@babel/polyfill',
            "./src/js/people_list",
        ],
        styles_head: "./src/style.js"
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.twig',
            chunks:['app','styles_head', 'main_page']
        }),
        new HtmlWebpackPlugin({
            template: './src/people_list.twig',
            filename: 'people_list.html',
            chunks:['app', 'styles_head', 'people_list']
        }),
        new HtmlWebpackInjector(),
        new CleanWebpackPlugin()
    ],
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {presets: ['@babel/preset-env']}
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.(jpeg|png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.twig$/,
                use: [
                    'twig-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
};
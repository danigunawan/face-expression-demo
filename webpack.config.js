const path = require('path');
const webpack = require('webpack');

const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {

    let isDev = argv.mode !== 'production';

    return {


        /**
         * ==================================================================================
         * Development
         * ==================================================================================
         **/

        mode: isDev ? 'development' : 'production',
        devtool: isDev ? 'inline-source-map' : false,
        devServer: {
            contentBase: './',
            hot: true
        },




        /**
         * ==================================================================================
         * Configuration
         * ==================================================================================
         **/

        entry: {
            app: './src/js/app.js',
        },
        output: {
            filename: isDev ? '[name].js' : '[name].[hash].min.js',
            publicPath: './',
            path: path.resolve(__dirname, 'dist/')

            /**
             * For github purposes!
             * - Link fontawesome & Permanent Marker font on the index.html not on NPM
             * - Remove _fontawesome.scss on styles.scss
             * - Add in public path on the FaceDetectAttr.js
             */
            // publicPath: './face-expression-demo/',
            // path: path.resolve(__dirname, 'gh-pages')

        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    },
                    styles: {
                        test: /\.(sa|sc|c)ss$/,
                        name: 'styles',
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },


        /**
         * Suppress the `fs not found` error when building brought by `Face-api.js`
         */
        node: {
            fs: "empty"
        },


        resolve: {
            modules: ['node_modules'],
            alias: {
                'faceapi': 'faceapi'
            }
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: !isDev,
                debug: isDev
            }),

            new webpack.ProvidePlugin({}),

            new Dotenv(),

            new CleanWebpackPlugin({
                /**
                 * !@TEMPORARY FIX: Webpack doesn't copy the specified static files on `watch` mode updates.
                 * Disables cleaning on `dev`/`watch` builds to avoid this for now
                 */
                dry: isDev,
            }),

            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),

            new MiniCssExtractPlugin({
                filename: isDev ? '[name].css' : '[name].[hash].css',
                chunkFilename: isDev ? '[id].css' : '[id].[hash].css'
            }),

            new CopyWebpackPlugin([
                {from: 'src/assets/', to: 'assets'},
                {from: 'src/favicon.ico', to: ''},

                {from: './node_modules/@fortawesome/fontawesome-free/webfonts/', to: 'assets/webfonts/'}
            ])
        ],


        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev,
                                reloadAll: true,
                            },
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /.(woff(2)?|ttf|eot|jpg|jpeg|png|svg)$/,
                    use: ['file-loader'],
                },
            ]
        }
    }
};
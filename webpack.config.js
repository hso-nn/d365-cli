const path = require("path"),
    webpack = require("webpack"),
    DEBUG = process.env.NODE_ENV !== "production",
    mode = DEBUG ? "development" : "production",
    dir_build = path.resolve(__dirname, "bin"),
    WebpackAutoInject = require("webpack-auto-inject-version"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
    nodeExternals = require("webpack-node-externals");

const postcssLoader = {
        loader: "postcss-loader",
        options: {
            plugins: function () {
                return [
                    require("autoprefixer")({
                        browsers: ["Android > 0","last 3 versions", "> 1%"]
                    }),
                    require("cssnano")({zindex: false})
                ];
            }
        }
    },
    scssLoaders = [DEBUG ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", postcssLoader, "sass-loader"],
    cssLoaders = [DEBUG ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", postcssLoader];

module.exports = {
    mode: mode,
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    entry: {
        "root/deploy/deploy": [
            path.resolve(__dirname, "src/root/Deploy/App.ts")
        ],
        "hso-d365": [
            path.resolve(__dirname, "src/hso-d365.ts")
        ]
    },
    output: {
        path: dir_build,
        filename: "[name].js"
    },
    resolve: {
        extensions: [".js", ".json", ".ts"]
    },
    module: {
        rules: [{
            enforce: "pre",
            test: /\.js?$/,
            loader: "eslint-loader",
            options: {
                failOnWarning: false,
                failOnError: true
            },
            include: [
                path.resolve(__dirname, "./src")
            ],
            exclude: [
                path.resolve(__dirname, "./src/libs")
            ]
        },{
            loader: "babel-loader",
            test: /\.js$/,
            include: [
                path.resolve(__dirname, "./src"),
                path.resolve(__dirname, "./tests")
            ],
            exclude: [
                path.resolve(__dirname, "./src/libs")
            ]
        }, {
            test: /\.json$/, loader: "json-loader"
        }, {
            test: /\.scss$/, loader: scssLoaders
        }, {
            test: /\.css$/, loader: cssLoaders
        }, {
            test: /\.ts$/,
            enforce: "pre",
            use: [
                {
                    loader: "eslint-loader",
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }
            ]
        }, {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: false,
                InjectAsComment: false
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.BannerPlugin("HSO D365 CLI [AIV]{version}[/AIV] | (c) HSO Innovation"),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]/[name].css",
            chunkFilename: "[id].css",
        })
    ].concat(DEBUG ? [] : [
        new CopyWebpackPlugin([{
            from: "./**/**.png",
            to: dir_build,
            context: "src"
        }, {
            from: "./**/**.svg",
            to: dir_build,
            context: "src"
        }, {
            from: "./**/**.html",
            to: dir_build,
            context: "src"
        }, {
            from: "./root/**/**.json",
            to: dir_build,
            context: "src"
        }, {
            from: "locales/*",
            to: dir_build,
            context: "src/translation"
        }]),
    ]),
    stats: {
        colors: true
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: false,
                    }
                }
            })
        ]
    },
    devtool: mode === "development" ? "source-map" : false
};

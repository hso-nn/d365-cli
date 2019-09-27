var path = require("path"),
    webpack = require("webpack"),
    DEBUG = process.env.NODE_ENV !== "production",
    mode = DEBUG ? "development" : "production",
    dir_build = path.resolve(__dirname, "<%= publisher %>_/<%= projectabbr %>"),
    WebpackAutoInject = require("webpack-auto-inject-version"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    UglifyJSPlugin = require("uglifyjs-webpack-plugin");

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
    scssLoaders = [MiniCssExtractPlugin.loader, "css-loader", postcssLoader, "sass-loader"],
    cssLoaders = [MiniCssExtractPlugin.loader, "css-loader", postcssLoader];

module.exports = {
    mode: mode,
    entry: {
    },
    output: {
        path: dir_build,
        filename: "[name]/[name].js",
        library: ["<%= publisher %>", "<%= projectabbr %>", "[name]"],
        libraryTarget: "var",
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, `<%= publisher %>_`),
        hot: true,
        inline: true
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
            test: /\.json$/, loader: "json"
        }, {
            test: /\.scss$/, loader: scssLoaders
        }, {
            test: /\.css$/, loader: cssLoaders
        }, {
            test: /\.tsx?$/,
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
        new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.BannerPlugin("Advanced Field Service [AIV]{version}[/AIV] | (c) HSO Innovation"),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]/[name].css",
            // chunkFilename: "[id].css",
        })
    ].concat(DEBUG ? [
        new CopyWebpackPlugin([{
            from: "./**/**.html",
            to: dir_build,
            context: "src"
        }])
    ] : [
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
                        drop_console: mode !== "development",
                    }
                }
            })
        ]
    },
    devtool: mode === "development" ? "source-map" : false
};

var path = require("path"),
    webpack = require("webpack"),
    DEBUG = process.env.NODE_ENV !== "production",
    mode = DEBUG ? "development" : "production",
    dir_build = path.resolve(__dirname, "dist/<%= publisher %>_/<%= namespace %>"),
    WebpackAutoInject = require("webpack-auto-inject-version"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    TerserPlugin = require("terser-webpack-plugin"),
    ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");

const scssLoaders = [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
    cssLoaders = [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"];

module.exports = {
    mode: mode,
    entry: {
    },
    output: {
        path: dir_build,
        filename: "[name]/[name].js",
        library: ["<%= publisher %>", "<%= namespace %>", "[name]"],
        libraryTarget: "var",
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist/<%= publisher %>_"),
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
        new webpack.BannerPlugin("<%= description %> [AIV]{version}[/AIV] | (c) HSO Innovation"),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name]/[name].css",
            // chunkFilename: "[id].css",
        }),
        // Fix Microsoft CE Validation tool
        new ReplaceInFileWebpackPlugin([{
            dir: dir_build,
            test: /\.js$/,
            rules: [{
                search: /"==typeof/g,
                replace: '"===typeof'
            },{
                search: /"!=typeof/g,
                replace: '"!==typeof'
            }]
        }])
    ].concat(DEBUG ? [
        new CopyWebpackPlugin([{
            from: "./**/**.html",
            to: dir_build,
            context: "src"
        }]),
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
        minimize: mode !== "development",
        minimizer: [new TerserPlugin({
            extractComments: false,
            terserOptions: {
                compress: {
                    drop_console: mode !== "development"
                }
            }
        })]
    },
    devtool: mode === "development" ? "source-map" : false
};

const path = require("path"),
    webpack = require("webpack"),
    DEBUG = process.env.NODE_ENV !== "production",
    mode = DEBUG ? "development" : "production",
    dir_build = path.resolve(__dirname, "bin"),
    WebpackAutoInject = require("webpack-auto-inject-version"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    TerserPlugin = require("terser-webpack-plugin"),
    nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: mode,
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    entry: {
        "root/tools/deploy": [
            path.resolve(__dirname, "src/root/tools/Deploy.ts")
        ],
        "main": [
            path.resolve(__dirname, "src/main.ts")
        ]
    },
    output: {
        path: dir_build,
        filename: "[name].js"
    },
    resolve: {
        extensions: [".json", ".ts"]
    },
    module: {
        rules: [{
            test: /\.json$/, loader: "json-loader"
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

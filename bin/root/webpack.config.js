const path = require("path");
const webpack = require("webpack");
const dir_build = path.resolve(__dirname, "dist/<%= publisher %>_/<%= namespace %>");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");
const packageJson = require('./package.json');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
    const mode = argv.mode;
    const scssLoaders = [mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"];
    const cssLoaders = [mode === "development" ? "style-loader" :  MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"];
    return {
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
                test: /\.scss$/,
                use: scssLoaders,
            }, {
                test: /\.css$/,
                use: cssLoaders,
            }, {
                test: /\.tsx?$/,
                use: "ts-loader",
            }]
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.BannerPlugin(`<%= description %> ${packageJson.version} | (c) HSO Innovation`),
            new MiniCssExtractPlugin({
                filename: "[name]/[name].css",
            }),
            new ESLintPlugin({
                extensions: ["ts", "tsx"],
            }),
            // Fix Microsoft CE Validation tool
            new ReplaceInFileWebpackPlugin([{
                dir: dir_build,
                test: /\.js$/,
                rules: [{
                    search: /"==typeof/g,
                    replace: '"===typeof'
                }, {
                    search: /"!=typeof/g,
                    replace: '"!==typeof'
                }]
            }]),
        ].concat(mode === "development" ? [
            new CopyWebpackPlugin({
                patterns: [{
                    from: "./**/**.html",
                    to: dir_build,
                    context: "src"
                }]
            }),
        ] : [
            new CopyWebpackPlugin({
                patterns: [{
                    from: "./**/**.(html|png|svg)",
                    to: dir_build,
                    context: "src",
                    noErrorOnMissing: true,
                }, {
                    from: "locales/*",
                    to: dir_build,
                    context: "src/translation",
                    noErrorOnMissing: true,
                }]
            }),
        ]),
        stats: {
            colors: true
        },
        optimization: {
            minimize: mode === "production",
            minimizer: [new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: mode === "production"
                    }
                }
            })]
        },
        devtool: mode === "development" ? "source-map" : false,
    }
};

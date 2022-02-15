import path from 'path';
import webpack from 'webpack';
import ESLintPlugin from 'eslint-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import CopyWebpackPlugin from 'copy-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TerserPlugin from 'terser-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import packageJson from './package.json';

const dir_build = path.resolve(__dirname, "bin");

const configFunction = (env: unknown, argv: {mode: string}) =>  {
    const mode = argv.mode;
    return {
        mode: mode,
        node: {
            __dirname: false,
            __filename: false
        },
        // target: "node",
        externalsPresets: {node: true},
        externals: [nodeExternals()],
        entry: {
            "main": [
                path.resolve(__dirname, "src/commands/main.ts")
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
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }]
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),
            new webpack.BannerPlugin(`HSO D365 CLI ${packageJson.version} | (c) HSO Innovation`),
            new ESLintPlugin({
                extensions: ['ts', 'tsx'],
            }),
        ].concat(mode === "development" ? [] : [
            // new CopyWebpackPlugin({
            //     patterns:[{
            //         from: "./root/**/*.json",
            //         to: dir_build,
            //         context: "src"
            //     }]
            // }),
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
                        drop_console: false, // needed for command line!
                    }
                }
            })]
        },
        devtool: mode === "development" ? "source-map" : false,
    }
};
export default configFunction;

// @ts-ignore
import path from 'path';
// @ts-ignore
import webpack from 'webpack';
import ESLintPlugin from 'eslint-webpack-plugin';
// @ts-ignore
import CopyWebpackPlugin from 'copy-webpack-plugin';
// @ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import TerserPlugin from 'terser-webpack-plugin';
// @ts-ignore
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';

// @ts-ignore
import packageJson from './package.json';
// @ts-ignore
import crmJson from '../crm.json';
const publisherPrefix = crmJson.crm.publisher_prefix;
const namespace = crmJson.crm.namespace;
const dir_build = path.resolve(__dirname, `dist/${publisherPrefix}_/${namespace}`);
import * as shell from 'shelljs';
import * as fs from 'fs';

interface BuildJson {
    forms: FormJson[];
    webresources: WebresourceJson[];
}

interface FormJson {
    name: string;
    build: boolean;
}

interface WebresourceJson extends FormJson {
    template: 'React' | 'HTML';
}

interface Entry {
    [index: string]: string[];
}

const guid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const buildFiles = shell.ls('./src/**/build.json');
const entry: Entry = {};
for (const filepath of buildFiles) {
    const pathSplit = filepath.split('/');
    const entityName = pathSplit[pathSplit.length - 2];
    const buildJsonString = String(fs.readFileSync(filepath));
    const buildJson = JSON.parse(buildJsonString) as BuildJson;
    for (const form of buildJson.forms) {
        const {name, build} = form;
        if (build) {
            const isTsPath = fs.existsSync(path.resolve(__dirname, `src/${entityName}/${name}/${name}.ts`));
            const isTsxPath = fs.existsSync(path.resolve(__dirname, `src/${entityName}/${name}/${name}.tsx`));
            const extension = isTsPath ? 'ts' : isTsxPath ? 'tsx' : 'js';
            entry[guid()] = {
                // @ts-ignore
                import: path.resolve(__dirname, `src/${entityName}/${name}/${name}.${extension}`),
                filename: `${entityName}/${name}.js`,
                library: {
                    name: [publisherPrefix, namespace, entityName, name],
                    type: 'var'
                },
            };
        }
    }
    for (const webresource of buildJson.webresources) {
        const {name, build, template} = webresource;
        if (build) {
            entry[guid()] = {
                // @ts-ignore
                import: path.resolve(__dirname, `src/${entityName}/${name}.${template === 'React' ? 'tsx' : 'ts'}`),
                filename: `${entityName}/${name}.js`,
                library: {
                    name: [publisherPrefix, namespace, entityName, name],
                    type: 'var'
                },
            };
        }
    }
}

// eslint-disable-next-line max-lines-per-function
const configFunction = (env: unknown, argv: {mode: string }): unknown => {
    const mode = argv.mode;
    const scssLoaders = [mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'];
    const cssLoaders = [mode === 'development' ? 'style-loader' :  MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'];
    return {
        mode: mode,
        entry: entry,
        output: {
            path: dir_build,
        },
        resolve: {
            extensions: ['.js', '.json', '.ts', '.tsx']
        },
        devServer: {
            static: path.resolve(__dirname, `dist/${publisherPrefix}_`),
            hot: true,
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
                use: 'ts-loader',
            }]
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
            new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),
            new webpack.BannerPlugin(`${packageJson.description} ${packageJson.version} | (c) HSO Innovation`),
            new MiniCssExtractPlugin({
                filename: '[name]/[name].css',
            }),
            new ESLintPlugin({
                extensions: ['ts', 'tsx'],
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
        ].concat(mode === 'development' ? [
            new CopyWebpackPlugin({
                patterns: [{
                    from: './**/**.html',
                    to: dir_build,
                    context: 'src',
                    noErrorOnMissing: true,
                }]
            }),
        ] : [
            new CopyWebpackPlugin({
                patterns: [{
                    from: './**/**.(html|png|svg)',
                    to: dir_build,
                    context: 'src',
                    noErrorOnMissing: true,
                }, {
                    from: 'locales/*',
                    to: dir_build,
                    context: 'src/translation',
                    noErrorOnMissing: true,
                }]
            }),
        ]),
        stats: {
            colors: true
        },
        optimization: {
            minimize: mode === 'production',
            minimizer: [new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: mode === 'production'
                    }
                }
            })]
        },
        devtool: mode === 'development' ? 'source-map' : false,
    };
};
export default configFunction;

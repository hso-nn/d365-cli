// Karma configuration
// Generated on Tue Oct 23 2018 17:26:53 GMT+0200 (W. Europe Daylight Time)
var path = require("path");
var webpackConfig = require("./webpack.config.js");
webpackConfig.module.rules.push({
    test: /\.ts$/,
    exclude: [
        path.resolve(__dirname, "test"),
        /node_modules|\.spec\.ts$/,
    ],
    enforce: "post",
    use: {
        loader: "istanbul-instrumenter-loader",
        options: { esModules: true }
    }
});

module.exports = function (config) { //eslint-disable-line max-lines-per-function
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../..",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],


        // list of files / patterns to load in the browser
        files: [
            "test-main.js"
        ],


        // list of files / patterns to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "./test-main.js": ["webpack", "sourcemap"],
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "junit", "coverage"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        webpack: webpackConfig,

        // Concurrency level
        // how many browser should be started simultaneous
        // concurrency: Infinity,

        junitReporter: {
            outputDir: "testresults/unittest", // results will be saved as $outputDir/$browserName.xml
            outputFile: "unittest-junit.xml", // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: "unittest", // suite will become the package name attribute in xml testsuite element
            useBrowserName: true, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
            properties: {} // key value pair of properties to add to the section of the report
        },

        coverageReporter: {
            // specify a common output directory
            dir: "testresults/coverage",
            reporters: [
                // reporters not supporting the `file` property
                { type: "html", subdir: "report-html" },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                //{ type: 'text', subdir: '.', file: 'text.txt' },
                //{ type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
                { type: "cobertura", subdir: ".", file: "cobertura.xml" }
            ]
        }
    });
};

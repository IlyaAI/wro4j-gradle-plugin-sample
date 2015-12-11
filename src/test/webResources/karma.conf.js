module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
            '$srcMain/js/foo.js',
            '$srcTest/js/*.spec.js'
        ],

        exclude: [],
        preprocessors: {},
        reporters: ['progress'],
        port: 9876,
        colors: false,
        logLevel: config.LOG_ERROR,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};

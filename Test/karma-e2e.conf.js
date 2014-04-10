module.exports = function(config){
  config.set({
 
   basePath : './',

    frameworks: ['ng-scenario'],

    files : [
    '../public/js/*.js',
    '../public/js/controllers/*.js',
    '../public/lib/*.js',
    './lib/angular/*.js',
    './*.js',
    './node_modules/**/*.js',
    './lib/angular/angular-mocks.js',
    './node_modules/karma-ng-scenario/lib/*.js',
    './e2e/*.js'
    ],

    autoWatch : true,

    singleRun : true,

    browsers : ['Firefox'],

    plugins : [
            'karma-ng-scenario',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    urlRoot : '/__karma/',

    proxies : {
      '/public/' : 'http://localhost:8080'
    }

  });
};
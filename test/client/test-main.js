var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.js$/.test(file)
            && !/test-main.js/.test(file)
            && !/node_modules/.test(file)
            && !/test\/client\/lib/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
      'angularjs': 'test/client/lib/angular/angular-1.1.5',
      'angular-resource-jam': 'public/behaviour/vendor/angular-resource-jam/resource-jam',

      // 'sinon': 'public/behaviour/vendor/sinon',

    },

    shim: {
      'angularjs': {
        exports: 'angular'
      }
    },

    // priority: {
    //     'angularjs'
    // },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function () {
        window.__karma__.start();
    }
});

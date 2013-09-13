var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        // 'angularjs': 'public/behaviour/vendor/angularjs',
        // 'angular-resource-jam': 'public/behaviour/vendor/angular-resource-jam',
        // 'sinon': 'public/behaviour/vendor/sinon',
    },

    shim: {
        // 'sinon': {
        //     exports: 'sinon'
        // }
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
define('core/app', ['angularjs'], function () {
    'use strict';

    var angularModule = angular.module('core/app', []),
        app = {};

    app.init = function (moduleNames) {
        angularModule.config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: "partial/tweets.html",
                    controller: "TwitterCtrl"
                })
                .when('/signup', {
                  templateUrl: "partial/signup.html",
                  controller: "SignupCtrl"
                })
                .otherwise({ redirectTo: '/' });
        });
        angular.bootstrap(document, moduleNames);
    };
    app.__defineGetter__('name', function () { return angularModule['name']; });
    app.__defineGetter__('core/app', function () { return angularModule; })

    return app;
});

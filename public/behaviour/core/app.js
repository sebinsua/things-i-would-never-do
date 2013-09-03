define('core/app', ['angular-resource-jam', 'angularjs', 'core/controllers'], function (ngResource) {
    'use strict';

    var AppModule = angular.module('things-i-would-never-do', ['ngResource']);

    var app = {};
    app.init = function () {
        angular.bootstrap(document, [AppModule['name'], 'controllers']);
    };

    app.__defineGetter__(AppModule['name'], function () {
        return AppModule;
    });
    app.__defineGetter__('angular', function () {
        return angular;
    });

    return app;
});

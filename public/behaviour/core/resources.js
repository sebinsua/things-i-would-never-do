define(['angularjs'], function () {
    'use strict';

    var resources = angular.module('resources', []);

    resources.factory('twitter', ['$resource', function ($resource) {
        return {
            fetchPopular: function (callback) {
                callback("word");
            }
        };
    }]);

    return resources;
});

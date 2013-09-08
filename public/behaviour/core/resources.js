define('core/resources', ['angularjs', 'angular-resource-jam'], function () {
    'use strict';

    var resources = angular.module('core/resources', ['ngResource']);

    resources.factory('twitter', ['$http', function ($http) {
        return {
            query: function (queryString) {
                queryString = queryString || "#thingsiwouldneverdo"
                return $http.get('/twitter/search/tweets?q=' + queryString);
            }
        };
    }]);

    return resources;
});

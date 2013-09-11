define('core/resources', ['angularjs', 'angular-resource-jam'], function () {
    'use strict';

    var resources = angular.module('core/resources', ['ngResource']);

    resources.factory('twitter', ['$http', function ($http) {
        return {
            query: function (_query) {
                var url = '/twitter/search/tweets';
                var queryString;
                if (_query) {
                  queryString = '?q=' + _query;
                }

                return $http.get(url + queryString);
            }
        };
    }]);

    return resources;
});

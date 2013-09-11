define('core/controllers', ['angularjs'], function () {
    'use strict';

    var controllers = angular.module('core/controllers', []);

    controllers.controller('TwitterCtrl', ['$scope', 'twitter', function ($scope, twitter) {
        $scope.tweets = [];

        $scope.statusClass = "status"
        $scope.statusMessage = "Loading tweets...";

        twitter.query("#thingsiwouldneverdo").success(function (tweets) {
            $scope.tweets = tweets;
        }).error(function (err) {
            $scope.statusClass = "error";
            $scope.statusMessage = "Error loading tweets."
        });

        $scope.$on("$viewContentLoaded", function () {
          // Fix to allow the twitter javascript from the ng-view to run. :)
          !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
        });
    }]);

    controllers.controller('SignupCtrl', ['$scope', function ($scope) {

    }]);

    return controllers;
});

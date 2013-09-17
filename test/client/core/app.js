define(['core/controllers', 'core/resources'], function () {
  'use strict';

  var getHttpPromiseMock = function ($q) {
    var deferred = $q.defer();
    deferred.promise.success = function (fn) {
      var config = {};
      deferred.promise.then(function (response) {
        fn(response.data, response.status, response.headers, config);
      });
      return deferred.promise;
    };
    deferred.promise.error = function (fn) {
      var config = {};
      deferred.promise.then(null, function (response) {
        fn(response.data, response.status, response.headers, config);
      });
      return deferred.promise;
    };

    return deferred;
  };

  beforeEach(angular.mock.module("core/controllers", "core/resources"));

  describe('TwitterCtrl', function () {

    var TwitterServiceFactory;
    beforeEach(angular.mock.inject(function ($q) {

      TwitterServiceFactory = function () {
        this.get = function (data, status, headers) {
          return {
            query: function (_query) {
              var deferred = getHttpPromiseMock($q);
              deferred.resolve({
                data: data,
                status: status,
                headers: headers
              });

              return deferred.promise;
            }
          };
        };
        this.getErr = function (data, status, headers) {
          return {
            query: function (_query) {
              var deferred = getHttpPromiseMock($q);
              deferred.reject("The Twitter Service failed to produce a response.");

              return deferred.promise;
            }
          };
        }
      };

    }));

    it('should respond with tweets if API call was successful', function () {
      var scope;
      angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        var data = [
          {
            user: {
              screen_name: "sebinsua",
              name: "Seb Insua"
            },
            text: "Here is some text that I wrote."
          },
          {
            user: {
              screen_name: "gilly",
              name: "Gilly Leonard"
            },
            text: "Here is some text that she wrote."
          }
        ];
        var fakeTwitter = (new TwitterServiceFactory()).get(data, 200, []);

        var ctrl = $controller("TwitterCtrl", { $scope: scope, twitter: fakeTwitter });
        scope.$apply();
      });

      expect(scope.tweets.length).to.equal(2);
    });

    it('should respond with no tweets and an error if the API call was unsuccessful', function () {
      var scope;
      angular.mock.inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();

        var data = [];
        var fakeTwitter = (new TwitterServiceFactory()).getErr(data, 404, []);

        var ctrl = $controller("TwitterCtrl", { $scope: scope, twitter: fakeTwitter });
        scope.$apply();
      });

      expect(scope.tweets.length).to.equal(0);
      expect(scope.statusClass).to.equal("error");
    });

  });

});

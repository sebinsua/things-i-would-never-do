define([], function () {
  'use strict';

  describe('Sanity Test', function () {

    it('should pass this', function () {
      expect(1).to.equal(1);
    });

    it('and this', function () {
      expect(1).to.equal(1);
    });

  });

  describe("Unit: Testing Controllers", function () {

    beforeEach(function () {
      angular.mock.module("core/app");
    });

    it("should have a controller", function () {
      // expect(App.TwitterCtrl).not.to.equal(null);
    });

  });

});

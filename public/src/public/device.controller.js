(function () {
    "use strict";

    angular.module('device')
        .controller('deviceController', deviceController);
    
    deviceController.$inject = ['$scope', '$rootScope'];
    function deviceController($scope, $rootScope) {
      console.log($rootScope.currentUser);
    }

})();
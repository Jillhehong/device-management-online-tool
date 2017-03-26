(function () {
    "use strict";

    angular.module('device')
        .controller('deviceController', deviceController);
    
    deviceController.$inject = ['$scope', '$http'];
    function deviceController($scope, $http) {
        $scope.logout = function(){
            $http.post("/logout")
                .then(function(response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                });
        }
    }
})();




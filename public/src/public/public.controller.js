(function () {
    "use strict";

    angular.module('device')
        .controller('publicController', publicController);

    publicController.$inject = [ '$http', 'cookiesFactory', '$location'];
    function publicController( $http, cookiesFactory, $location) {
        var publicCtrl = this;

        publicCtrl.username = cookiesFactory.getUsernameCookie();
        
        publicCtrl.logout = function(){

            $http.get("/logout")
                .then(function(response) {
                    //clear cookie username
                    cookiesFactory.clearUsernameCookies();
                    //redirect url to login page
                    $location.url("/login");
                }, function (err) {
                    console.log(err);
                });
        }
    }
})();




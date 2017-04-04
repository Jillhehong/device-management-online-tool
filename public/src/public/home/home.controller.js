(function () {
    "use strict";

    angular.module('device')
        .controller('homeController', homeController);

    homeController.$inject = ['cookiesFactory'];
    function homeController(cookiesFactory){
        var homeCtrl = this;
        //get username
        homeCtrl.username = cookiesFactory.getUsernameCookie();



    }
        
})();
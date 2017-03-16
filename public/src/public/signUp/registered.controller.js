/**
 * Created by hhe on 2/6/2017.
 */
(function () {
    "use strict";

    angular.module('public')
        .controller('registeredController', registeredController);

    registeredController.$inject = ['userInfo', 'MenuService'];
    function registeredController(userInfo, MenuService) {
        var info = this;
        info.userInfo = userInfo; 
        // console.log('user info', $ctrl.userInfo);
        if(userInfo){
            info.completed = true;
            var promise = MenuService.getShortName(userInfo.menuNumber);
            promise.then(function (response) {
                console.log(response);
                info.menuItem = response.data;
            });
        }
    }

})();

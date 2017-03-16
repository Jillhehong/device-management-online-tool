/**
 * Created by hhe on 2/6/2017.
 */
(function () {
    "use strict";

    angular.module('public')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['MenuService'];
    function RegistrationController(MenuService) {
        var reg = this;
        var userInfo;

        reg.submit = function () {

            var promise = MenuService.getShortName(reg.user.menuNumber);
                promise.then(function (response) {
                    // console.log(response);
                    reg.completed = false;
                    reg.saved = true;
                    userInfo = {
                                firstName: reg.user.firstName,
                                lastName: reg.user.lastName,
                                email: reg.user.email,
                                phone: reg.user.phone,
                                menuNumber: reg.user.menuNumber
                    };
                    
                    MenuService.setInfo(userInfo);
                    // console.log('get user info', MenuService.getInfo());
                    
                    // console.log(reg.userInfo);
                },
                function (response) {
                    console.log(response);
                    reg.completed = true;
                    reg.saved = false;
                });
        };

    }

})();

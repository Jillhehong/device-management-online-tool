/**
 * Created by hhe on 2/6/2017.
 */
(function () {
    "use strict";

    angular.module('public')
        .controller('registerController', registerController)
        .controller('loginController', loginController);
    
    
///registration controller////////
    registerController.$inject = ['deviceService'];
    function registerController(deviceService) {
        var reg = this;
        reg.saved = false;

        // reg.user = {firstName: '', lastName: '', email: '', username:'', password1: ''};

        reg.submit = function () {
            console.log('test');

            ///set users////
            var userInfo = {
                firstName: reg.user.firstName,
                lastName: reg.user.lastName,
                username: reg.user.username,
                email: reg.user.email,
                password: reg.user.password1
            };

            /// post users data into server
             deviceService.setUsers('todo/users',{data: [userInfo.firstName, userInfo.lastName, userInfo.username, userInfo.email,  userInfo.password]} )
            .then(function (response) {
                    reg.saved = true;
                  console.log('insert users success');
                
                },
                function (error) {
                    console.log(error);
                });
        };

    }
    
    
    ////login controller
    loginController.$inject = ['deviceService', '$location', '$rootScope', '$http', 'Auth'];
    function loginController(deviceService,   $location, $rootScope, $http, Auth) {
        var login = this;

        login.user = { username: "", password : ''};

        login.submit = function () {
            $http.post('/login', login.user)
                .then(function (response) {

                    $rootScope.currentUser = response.data.username;

                    Auth.setUser(response.data.username);
                    $location.url('/home');




                }, function (error) {
                    
                    console.log('failed to login');

                });
        }

        
    }

})();

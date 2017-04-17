/**
 * Created by hhe on 2/6/2017.
 */
(function () {
    "use strict";

    angular.module('public')
        .controller('registerController', registerController)
        // .directive('pwCheck', pwCheck)
        .controller('loginController', loginController);

    //create directive pwCheck to check passwords the same value
    // function pwCheck() {
    //         return {
    //             require: 'ngModel',
    //             link: function (scope, elem, attrs, ctrl) {
    //                 var firstPassword = '#' + attrs.pwCheck;
    //                 elem.add(firstPassword).on('keyup', function () {
    //                     scope.$apply(function () {
    //                         var v = (elem.val()===$(firstPassword).val() );
    //                         ctrl.$setValidity('pwmatch', v);
    //                     });
    //                 });
    //             }
    //         }
    //     }




///registration controller////////
    registerController.$inject = ['deviceService'];
    function registerController(deviceService) {
        var reg = this;
        reg.user = {
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        };

        reg.submit = function () {
            /// post users data into server
             deviceService.setUsers('/todo/users', reg.user )
            .then(function (response) {
                    reg.msg = 'Thank you, your information has been saved!';
                },
                function (error) {
                    reg.msg = error.data.detail;
                });
        };
            //keyup
        reg.keyup = function(){
            if(reg.user.password == reg.user.password2) {
                reg.showMsg = false;
            }
            else {
                reg.showMsg = true;
            }
        }
        

    }
    
    
    ////login controller
    loginController.$inject = [ '$location', '$http','cookiesFactory'];
    function loginController($location, $http, cookiesFactory) {
        var login = this;

        ///define variables in controller used in the login.html
        login.showAlert = false;
        login.user = { username: "", password : ''};
        login.close = function(){
            login.showAlert = false;
        };

        login.submit = function () {
           /* $http service post username and password to server side, then use passport.js to authenticate user info.
            /if user verified, then execute codes following. if not, give a username/password failed alert on page*/
            $http.post('/login', login.user)
                .then(function (response) {
                    ///store username in cookies which defined in 'cookiesFactory'
                    cookiesFactory.setUsernameCookie(response.data.username);
                    ///direct url to home page if successfully log in
                    $location.url('/home');
                    
                }, function (error) {
                    ///failed log in, display alert msg
                    login.showAlert = true;
                    login.error = 'Incorrect username or password';
                });
        }

        
    }

})();

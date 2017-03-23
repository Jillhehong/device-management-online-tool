/**
 * Created by hhe on 2/6/2017.
 */
(function () {
    "use strict";

    angular.module('public')
        .config(routeConfig)
        .controller('RegistrationController', RegistrationController)
        .controller('loginController', loginController);

    routeConfig.$inject = ['$stateProvider'];
    function routeConfig($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: '/src/public/signup/register.html',
                controller: 'RegistrationController'
                
            })
            .state('login', {
                url: '/login',
                templateUrl: '/src/public/signup/login.html',
                controller: 'loginController'
            })
            // .state('home', {
            //     url: '/home',
            //     templateUrl: '/index.html'
            // })

    }

    
///registration controller////////
    RegistrationController.$inject = ['deviceService'];
    function RegistrationController(deviceService) {
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
    loginController.$inject = ['deviceService', '$location', '$rootScope'];
    function loginController(deviceService,   $location, $rootScope) {
        var login = this;

        login.uesr = { email: '', password : ''};

        login.submit = function (user) {
            // AuthService.login(credentials).then(function (user) {
            //     $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            //     $scope.setCurrentUser(user);
            // }, function () {
            //     $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            // });


            deviceService.getUsers('/todo/email')
                .then(function (response) {
                    console.log('success login');
                    console.log('response ', response.data);

                    for(var i=0;i<response.data.length;i++){
                        if(response.data[i].email == login.email.trim() && response.data[i].password == login.password.trim()) {
                                console.log('true');
                            // $location.url('/index');
                            // $window.location.href('/index');
                        }
                        else {
                            $location. url('/login');
                        }
                    }

                    // if(response.data.email.indexOf(  login.email.trim() ) > -1 ){
                    //     console.log('true');
                    // }

                }, function (error) {
                    console.log('failed to login');
                }); 
        };
       
    }

})();

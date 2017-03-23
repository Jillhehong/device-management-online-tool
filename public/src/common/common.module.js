(function() {
"use strict";

angular.module('common', [])
.constant('ApiPath', 'http://localhost:3000/')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });
    
    
// .config(config);

// config.$inject = ['$httpProvider'];
// function config($httpProvider) {
//   $httpProvider.interceptors.push('loadingHttpInterceptor');
// }

})();

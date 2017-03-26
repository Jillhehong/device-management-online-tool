(function() {
"use strict";

/**
 * Restaurant module that includes the public module as a dependency
 */
angular.module('device', ['public','ngTable', 'ui.bootstrap'])
    // .run(['$rootScope', 'Auth', '$state','$location',  function ($rootScope, Auth, $state, $location) {
    //
    //
    //   $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //
    //     // console.log('state ', toState.authenticate);
    //     console.log('autheticate ', Auth.isLoggedIn());
    //     // User isn’t authenticated
    //     if (!Auth.isLoggedIn() ) {
    //
    //       // console.log('true again', toState.authenticate);
    //       // $state.transitionTo("login");
    //       event.preventDefault();
    //
    //       // $location.url('/login');
    //     }
    //   });
    //
    // }
    // ])
  .config(config);


config.$inject = ['$urlRouterProvider'];
function config($urlRouterProvider) {

  // If user goes to a path that doesn't exist, redirect to public root
  $urlRouterProvider.otherwise('/');
}

})();

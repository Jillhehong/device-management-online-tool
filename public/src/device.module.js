(function() {
  "use strict";

  angular.module('device', ['public', 'ngTable', 'ui.bootstrap', "chart.js"])
  ///angular.run() runs first, then angular.config runs, then angular.controller runs last.
      .run(appRun);

    appRun.$inject = ['$rootScope', '$location', 'cookiesFactory'];
    function appRun($rootScope,  $location, cookiesFactory){


        ////// $rootScope.$on() monitoring  $stateChangeStart (it fires every time when route changes)
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            // get username from cookiesFactory service, username is stored in cookies session
             var user = cookiesFactory.getUsernameCookie();
            if (  !user ) {
                $location.url('/login');
            }

        });
        }

})();

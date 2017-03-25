(function() {
'use strict';

angular.module('public')
.config(routeConfig);

/**
 * Configures the routes and views
 */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('public', {
            abstract: true,
            templateUrl: 'src/public/public.html'
        })
        .state('public.home', {
            url: '/',
            templateUrl: 'src/public/home/home.html'
        })
      
    .state('public.deviceManagement', {
      url: '/deviceManagement',
      templateUrl: 'src/public/device-management/device management.html'
    })
      .state('public.deviceManagement.device_list', {
          url: '/queryall',
          templateUrl: 'src/public/device-management/device-list.html',
          controller: 'showDeviceDataController',
          controllerAs: 'deviceList'
      })
      .state('public.deviceManagement.insert', {
          url: '/insert',
          templateUrl: 'src/public/device-management/insert.html',
          controller: 'deviceManagementInsertController',
          controllerAs: 'deviceCtrl'
      })
      .state('public.deviceManagement.query', {
          url: '/query',
          templateUrl: 'src/public/device-management/query.html',
          controller: 'deviceManagementQueryController',
          controllerAs: 'queryCtrl'
      })
      .state('public.deviceInventory', {
          url: '/deviceInventory',
          templateUrl: 'src/public/device-inventory/device-inventory.html',
          controller: 'deviceInventoryController',
          controllerAs: 'inventoryCtrl'
      })
      .state('public.accessoryInventory', {
          url: '/accessoryInventory',
          templateUrl: 'src/public/accessory-inventory/accessory.html',
          controller: 'accessoryController',
          controllerAs: 'accessoryCtrl'
      })
        .state('public.deviceHistory', {
        url: '/deviceHistory',
        templateUrl: 'src/public/device-history/device-history.html', 
        controller: 'deviceHistoryController',
        controllerAs: 'historyCtrl'
    })
        .state('public.signup', {
        url: '/signup',
        templateUrl: '/src/public/signup/register.html',
        controller: 'registerController',
        controllerAs: 'registerCtrl'
    })
        .state('public.signin', {
        url: '/login',
        templateUrl: '/src/public/signup/login.html',
        controller: 'loginController',
        controllerAs:  'loginCtrl'
    });
      
    
}
})();

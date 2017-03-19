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
    });
      
    
    
    
 // .state('public.menuitems', {
 //    url: '/menu/{category}',
 //    templateUrl: 'src/public/menu-items/menu-items.html',
 //    controller: 'MenuItemsController',
 //    controllerAs: 'menuItemsCtrl',
 //    resolve: {
 //      menuItems: ['$stateParams','MenuService', function ($stateParams, MenuService) {
 //        return MenuService.getMenuItems($stateParams.category);
 //      }]
 //    }
 //  })
 //  .state('public.signUp', {
 //    url: '/signUp',
 //    templateUrl: 'src/public/signUp/signUp.html',
 //    controller: 'RegistrationController',
 //    controllerAs: 'reg'
 //  })
 //      .state('public.registered', {
 //        url: '/registered',
 //        templateUrl: 'src/public/signUp/registered.html',
 //        controller: 'registeredController',
 //        controllerAs: 'info',
 //        resolve: {
 //          userInfo: ['MenuService', function (MenuService) {
 //            // console.log(MenuService.getInfo());
 //            return MenuService.getInfo();
 //          }]
 //        }
 //         
 //      });
  
}
})();

(function () {
"use strict";

angular.module('common')
.service('deviceService', deviceService);


  deviceService.$inject = ['$http', 'ApiPath'];
function deviceService($http, ApiPath) {
  var service = this;
  
  service.getCategories = function () {
    return $http.get(ApiPath + '/categories.json').then(function (response) {
      return response.data;
    });
  };


  service.getMenuItems = function (category) {
    var config = {};
    if (category) {
      config.params = {'category': category};
    }

    return $http.get(ApiPath + '/menu_items.json', config).then(function (response) {
      return response.data;
    });
  };

  service.getShortName = function (shortName) {
    return $http.get(ApiPath + '/menu_items/' + shortName + '.json');
  };

  //set and get user info
  var userInfo;
  service.setInfo = function (value) {
    userInfo = value;
  };
  
  service.getInfo = function() {
    return userInfo;
  };

  //
  var device_management_columns =
      ['P.O.','Device Registration Date','Device SN','ICCID (SIM)','IMEI','Model Number','Model Description','Firmware Version',
        'Manufacturer','Points To','Use Zywie SIM card','SIM Provider','Zywie Logo on Device','Wyless Provision date','Device Test Complete date',
        'Suspended Start Date','Status','Location','Checked Out by','Check Out Date','Check In by','Check In Date','Sales Team',
        'Salesperson Name','Enterprise ID','Parent Clinic','Sub Clinic','Physician','Billable ','Lease'
      ];
  service.getDeviceManagementColumns = function () {
    return device_management_columns;
  }
  
}

})();

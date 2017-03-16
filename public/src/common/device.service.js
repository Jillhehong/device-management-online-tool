(function () {
"use strict";

angular.module('common')
.service('deviceService', deviceService);


  deviceService.$inject = ['$http', 'ApiPath'];
function deviceService($http, ApiPath) {
  var service = this;
    
    var device_management_columns = ['col_number', 'purchase_order', 'registration_date', 'device_sn', 'iccid','imei',
        'model_number', 'model_description', 'firmware_version', 'manufacturer', 'points_to', 'use_zywie_sim', 'sim_provider', 'zywie_logo',
        'wyless_provision_date','device_test_date', 'device_suspension_date', 'status', 'location', 'checked_out_by', 'checked_out_date',
        'checked_in_by', 'checked_in_date', 'salesteam','salesperson_name', 'enterprise_id', 'clinic', 'physician', 'billable', 'lease', 'lease_price_per_month',
        'lease_start_date', 'lease_end_date'];

    service.getDeviceManagementColumns = function () {
    return device_management_columns;
  };
 
  service.postDeviceManagementData = function (string, data) {
    return $http.post(ApiPath + string, data);
  };
    service.getDeviceManagementData = function (string) {
        return $http.get(ApiPath + string);
    };
    



}

})();

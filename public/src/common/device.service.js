(function () {
"use strict";

angular.module('common')
.service('deviceService', deviceService)
    .factory('cookiesFactory', cookiesFactory);
    
    cookiesFactory.$inject = ['$cookies'];
    function cookiesFactory($cookies){
       
            var username = '';

            return {
                //username
                setUsernameCookie: function(data) {
                    username = data;
                    $cookies.put("username", username);
                },
                getUsernameCookie: function() {
                    return $cookies.get("username");
                },
                clearUsernameCookies: function () {
                    $cookies.remove('username');
                }
            }
    }
    
    
        
    deviceService.$inject = ['$http', 'ApiPath'];
    function deviceService($http, ApiPath) {
      var service = this;
    
        // device management table//
        var device_management_columns = [
            'purchase_order',
            'registration_date', 
            'device_sn',
            'iccid',
            'imei',
            'model_number',
            'model_description',
            'firmware_version',
            'manufacturer', 
            'points_to',
            'use_zywie_sim', 
            'sim_provider', 
            'zywie_logo', 
            'wyless_provision_date',
            'device_test_date', 
            'device_suspension_date',
            'status',
            'location', 
            'checked_out_by',
            'checked_out_date',
            'checked_in_by',
            'checked_in_date',
            'salesteam',
            'salesperson_name', 
            'enterprise_id', 
            'parent_clinic', 
            'sub_clinic',
            'physician',
            'billable', 
            'lease',
            'lease_price_per_month',
            'lease_start_date', 
            'lease_end_date'
        ];
        service.getDeviceManagementColumns = function () {
        return device_management_columns;
      };
    
        ////device inventory table///
        var device_inventory_columns = [
            'received_date',
            'order_id',
            'purchase_order' ,
            'manufacturer' ,
            'item' ,
            'order_quantity' ,
            'received_quantity' ,
            'deficiency_quantity',
            'deficiency_received_date' ,
            'shipping_status',
            'device_sn',
            'package_content'
        ];
        service.getInventoryColumns = function () {
            return device_inventory_columns;
        };
    
    
        ///device accessory table ///
    
        var device_accessory_columns = [
            'row',
            'received_date' ,
            'manufacturer_order_ID',
            'purchase_order' ,
            'manufacturer' ,
            'accessory' ,
            'lot_no' ,
            'order_quantity' ,
            'received_quantity',
            'deficiency' ,
            'deficient_received_date' ,
            'shipping_status' ,
            'total_price'
    
        ];
        service.getAccessoryColumns = function () {
            return device_accessory_columns;
        };
    
    
        ///device history table /////
        var device_history_columns = [
            'row',
            'history_date',
            'device_sn' ,
            'device_action' ,
            'by_whom',
            'status' ,
            'device_owner' ,
            'replace_device' ,
            'replaced_device_sn' ,
            'note'
        ];
        
        service.getHistoryColumns = function () {
            return device_history_columns;
        };
    ///////////////////
    
    
    
    
        //////post http data////
      service.postDeviceManagementData = function (string, data) {
        return $http.post(ApiPath + string, data);
      };
    
    
        //////get http data/////////
        service.getDeviceManagementData = function (string) {
            return $http.get(ApiPath + string);
        };
        
        /////post users data/////
        service.setUsers = function (string, data) {
            return $http.post(ApiPath + string, data);
    
        };
        //get users
        service.getUsers = function (string) {
            return $http.get(string);
        }
    }

})();

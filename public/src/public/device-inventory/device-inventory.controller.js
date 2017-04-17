
(function () {
    "use strict";

    angular.module('device')
        .controller('deviceInventoryController', deviceInventoryController);


    deviceInventoryController.$inject = ['deviceService', 'NgTableParams'];
    function deviceInventoryController(deviceService, NgTableParams) {
        var inventoryCtrl = this;

///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('/todo/device_inventory/queryall').then(function (response) {
            //add $index for tracking rows\
            var results = response.data;
            for(var i=0;i<results.length;i++){
                results[i].index = i;
            }
            
            inventoryCtrl.tableParams = new NgTableParams({
                page: 1 // show first page
            }, {
                dataset: response.data // length of data
            });
            inventoryCtrl.ngModelInputs = angular.copy(response.data);

        }, function (error) {
            console.log('query failed');
        });
    }
})();
/**
 * Created by hhe on 3/9/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('deviceManagementInsertController', deviceManagementInsertController);

    deviceManagementInsertController.$inject = ['deviceService'];
    function deviceManagementInsertController(deviceService) {
        var deviceCtrl = this;
        deviceCtrl.saved = false;
        var values = deviceService.getDeviceManagementColumns();
        deviceCtrl.deviceColumns = values;
        deviceCtrl.reg = new Array(values.length);
        
        // post inserted data into server
        deviceCtrl.submit = function () {
           deviceService.postDeviceManagementData('todo/insert',{data:deviceCtrl.reg} ).then(function (response) {
               deviceCtrl.saved = true;
               alert('insert success');

           }, function (response) {
               alert('insert failed');
           });
        };

    }


})();

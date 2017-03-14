/**
 * Created by hhe on 3/9/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('deviceManagementController', deviceManagementController);

    deviceManagementController.$inject = ['deviceService'];
    function deviceManagementController(deviceService) {
        var deviceCtrl = this;
        var deviceColumns = deviceService.getDeviceManagementColumns();
        // console.log('device columnname ', deviceColumns);
        deviceCtrl.columnNames = deviceColumns;
        
    }


})();

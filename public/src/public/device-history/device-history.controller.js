(function () {
    "use strict";

    angular.module('device')
        .controller('deviceHistoryController', deviceHistoryController);


    deviceHistoryController.$inject = ['deviceService'];
    function deviceHistoryController(deviceService) {
        var historyCtrl = this;
        historyCtrl.tableColumns = deviceService.getHistoryColumns();
       

///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('todo/device_history/queryall').then(function (response) {
            console.log('query success');
            historyCtrl.results = response.data;

        }, function (error) {
            console.log('query failed');
        });

    }

})();
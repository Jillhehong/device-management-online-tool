(function () {
    "use strict";

    angular.module('device')
        .controller('deviceHistoryController', deviceHistoryController);


    deviceHistoryController.$inject = ['deviceService', '$filter', 'NgTableParams'];
    function deviceHistoryController(deviceService, $filter, NgTableParams) {
        var historyCtrl = this;
        
        ///populate table data 
        historyCtrl.tableColumns = deviceService.getHistoryColumns();
        historyCtrl.cols = [];
        //populate table header names
        var values = historyCtrl.tableColumns;
        for (var i = 0; i < values.length; i++) {
            historyCtrl.cols.push({field: values[i], title: values[i], sortable: values[i], show: true});
        }
        

///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('todo/device_history/queryall').then(function (response) {
            console.log('query success');
            historyCtrl.results = response.data;

            historyCtrl.tableParams = new NgTableParams({
                page: 1      // show first page
                
            }, {
                dataset: historyCtrl.results // length of data
            });

        }, function (error) {
            console.log('query failed');
        });

    }

})();
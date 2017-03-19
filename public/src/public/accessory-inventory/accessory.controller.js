(function () {
    "use strict";

    angular.module('device')
        .controller('accessoryController', accessoryController);

    accessoryController.$inject = ['deviceService', '$filter', 'NgTableParams'];

    function accessoryController(deviceService, $filter, NgTableParams) {
        var accessoryCtrl = this;
        accessoryCtrl.tableColumns = deviceService.getAccessoryColumns();

///////////get data from http request from device_management table///////////
        accessoryCtrl.cols = [];
        //populate table header names
        for (var i = 0; i < accessoryCtrl.tableColumns .length; i++) {
            accessoryCtrl.cols.push({field: accessoryCtrl.tableColumns [i], title: accessoryCtrl.tableColumns [i], sortable: accessoryCtrl.tableColumns [i], show: true});

        }

        deviceService.getDeviceManagementData('todo/accessory/queryall')
            .then(function (response) {
                var data = response.data;
                accessoryCtrl.tableParams = new NgTableParams({
                    page: 1,            // show first page
                    count: 10, // count per page
                    sorting: {
                        col_number: 'asc'     // initial sorting
                    }
                }, {
                    dataset: data // length of data
                });


            }, function (error) {
                console.log('get data error');
            });

    }

})();
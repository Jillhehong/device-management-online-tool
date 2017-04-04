(function () {
    "use strict";

    angular.module('device')
        .controller('accessoryController', accessoryController);

    accessoryController.$inject = ['deviceService', '$filter', 'NgTableParams'];

    function accessoryController(deviceService, $filter, NgTableParams) {
        var accessoryCtrl = this;

        deviceService.getDeviceManagementData('todo/accessory/queryall')
            .then(function (response) {
                accessoryCtrl.tableParams = new NgTableParams({
                    page: 1            // show first page
                }, {
                    dataset: response.data 
                });


            }, function (error) {
                console.log('get data error');
            });
    }

})();
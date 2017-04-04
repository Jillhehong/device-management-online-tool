(function () {
    'use strict';
    angular.module('device')
        .controller('dashboardController',dashboardController);

    dashboardController.$inject = ['deviceService','NgTableParams'];
    function dashboardController(deviceService, NgTableParams) {
        var dashboardCtrl = this;

        //get total summary of devices
        deviceService.getDeviceManagementData('todo/dashboard/totalDevices')
            .then(function (response) {
                dashboardCtrl.results = response.data;
            }, function (error) {
                console.log(error);
            });

        //get available devices
        deviceService.getDeviceManagementData('todo/dashboard/availableDevices')
            .then(function (response) {
                console.log('response ', response);
                dashboardCtrl.counts = 0;
                for(var i=0; i<response.data.length;i++){
                    if(response.data[i].location == '"drawer1-active"' || 
                        response.data[i].location == '"drawer3-suspended"' ||
                        response.data[i].location == '"drawer4-inactive(misc)"') {

                        dashboardCtrl.counts ++;
                    }
                }

            }, function (error) {
                console.log(error);
            });

    }
})();
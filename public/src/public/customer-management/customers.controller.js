(function () {
    'use strict';
    angular.module('device')
        .controller('customersController', customersController);

    customersController.$inject = ['deviceService', 'NgTableParams'];
    function customersController(deviceService, NgTableParams) {
        var customerCtrl = this;

        deviceService.getDeviceManagementData('todo/customer')
            .then(function(response){
                customerCtrl.tableParams = new NgTableParams({
                    page:1,
                    // initial grouping
                    group: "parent_clinic"
                }, {
                    dataset: response.data 
                });

                //if reaches last page
                customerCtrl.isLastPage = function(){
                    return customerCtrl.tableParams.page() === totalPages();
                };
                function totalPages(){
                    return Math.ceil(customerCtrl.tableParams.total() / customerCtrl.tableParams.count());
                }
                
                //total devices
                customerCtrl.totalDevices = response.data.length;
            }, function (err) {
                console.log('error ', error);
            });
    }
})();
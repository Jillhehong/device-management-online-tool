/**
 * Created by hhe on 3/9/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('deviceManagementInsertController', deviceManagementInsertController)
        .controller('insertModalInstanceCtrl', insertModalInstanceCtrl);

    insertModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items', 'labels'];
    function insertModalInstanceCtrl($scope, $uibModalInstance, items, labels) {
        $scope.items = items;
        $scope.labels = labels;
    console.log('items ',items);
        console.log('labels ',labels);

        $scope.ok = function () {
            $uibModalInstance.close($scope.items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }



    deviceManagementInsertController.$inject = ['deviceService', '$uibModal', '$log'];
    function deviceManagementInsertController(deviceService, $uibModal, $log) {
        var deviceCtrl = this;
////set alert parameters//////
        deviceCtrl.show = false;
        deviceCtrl.type = 'test';
        deviceCtrl.msg = 'test';
        deviceCtrl.closeAlert = function () {
            deviceCtrl.show = false;
        };

        
        //////collapse button to upload file ///
        deviceCtrl.isCollapsed = false;
        
        
///////get table column names//////
        deviceCtrl.tableColumns = deviceService.getDeviceManagementColumns();
/////////define insert values for device management table/////////
        deviceCtrl.reg = new Array(deviceCtrl.tableColumns.length);
        
        // post inserted data into server
        deviceCtrl.submit = function () {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-management/device-insert-modal.html',
                controller: 'insertModalInstanceCtrl',
                resolve: {
                    labels: function () {
                        return deviceCtrl.tableColumns;
                    },
                    items: function () {
                        return deviceCtrl.reg;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {

                deviceService.postDeviceManagementData('todo/insert', {data: inputs})
                    .then(function (response) {
                        console.log('response ', response);
                        deviceCtrl.show = true;
                        deviceCtrl.type = 'alert-success';
                        deviceCtrl.msg = 'insert success';
                    }, function (error) {
                        console.log('error', error);
                        deviceCtrl.show = true;
                        deviceCtrl.type = 'alert-danger';
                        deviceCtrl.msg = error;
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

    }


})();

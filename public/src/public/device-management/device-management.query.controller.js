/**
 * Created by hhe on 3/12/2017.
 */

(function () {
    "use strict";

    angular.module('device')
        .controller('deviceManagementQueryController', deviceManagementQueryController)
        .controller('updateModalInstanceCtrl', updateModalInstanceCtrl)
        .controller('deleteModalInstanceCtrl', deleteModalInstanceCtrl);

    updateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items', 'labels'];
    deleteModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items', 'labels'];

    function updateModalInstanceCtrl($scope, $uibModalInstance, items, labels) {

        $scope.items = items;
        $scope.labels = labels;
        $scope.ngModelinputs = angular.copy($scope.items);

        $scope.ok = function () {
            $uibModalInstance.close($scope.ngModelinputs);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function deleteModalInstanceCtrl($scope, $uibModalInstance, items, labels) {
        $scope.items = items;
        $scope.labels = labels;
        
        $scope.ok = function () {
            $uibModalInstance.close($scope.items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    deviceManagementQueryController.$inject = ['deviceService', '$timeout','$uibModal', '$log'];
    function deviceManagementQueryController(deviceService, $timeout, $uibModal, $log) {
        var queryCtrl = this;
        queryCtrl.tableColumns = deviceService.getDeviceManagementColumns();

////////////////////////set alerts////////////////
        queryCtrl.show = false;
        queryCtrl.closeAlert = function () {
            queryCtrl.show = false;
        };
      
///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('todo/queryall').then(function (response) {
            console.log('query success');
            queryCtrl.results = response.data;

        }, function (error) {
            console.log('query failed');
        });
///////////////////show modal///////////////        
        queryCtrl.showModal = function (index) {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-management/device-update-modal.html',
                controller: 'updateModalInstanceCtrl',
                resolve: {
                    labels: function () {
                        return queryCtrl.tableColumns;
                    },
                    items: function () {
                        return queryCtrl.results[index];
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                //////transform to an array of data to feed post format data
                var transformedtoArrayData = [];
                for(var i=0;i<queryCtrl.tableColumns.length;i++){
                    transformedtoArrayData.push(inputs[queryCtrl.tableColumns[i]]);
                }
                transformedtoArrayData.push(inputs[queryCtrl.tableColumns[3]]);
                console.log(transformedtoArrayData);
                //////////
                deviceService.postDeviceManagementData('todo/update', {data:transformedtoArrayData}).
                then(function (response) {
                    queryCtrl.show = true;
                    queryCtrl.type = 'alert-success';
                    queryCtrl.msg = 'update success';
                }, function (error) {
                    queryCtrl.show = true;
                    queryCtrl.type = 'alert-danger';
                    queryCtrl.msg = 'update failed!!!';
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };
//////////////delete selected data///////////////////
        queryCtrl.deleteModal = function (index) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-management/device-delete-modal.html',
                controller: 'deleteModalInstanceCtrl',
                resolve: {
                    labels: function () {
                        return queryCtrl.tableColumns;
                    },
                    items: function () {
                        return queryCtrl.results[index];
                    }
                }
            });
            modalInstance.result.then(function (input) {
                // get device_sn value
                var device_sn = input.device_sn;
                console.log(input.device_sn);
                //////////
                deviceService.postDeviceManagementData('todo/delete/:_id', {data:[device_sn]})
                    .then(function (response) {
                    queryCtrl.show = true;
                    queryCtrl.type = 'alert-success';
                    queryCtrl.msg = 'delete success';
                }, function (error) {
                    queryCtrl.show = true;
                    queryCtrl.type = 'alert-danger';
                    queryCtrl.msg = 'delete failed!!!';
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };
    }
})();
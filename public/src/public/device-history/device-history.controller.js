(function () {
    "use strict";

    angular.module('device')
        .controller('deviceHistoryController', deviceHistoryController)
        .controller('historyupdateModalInstanceCtrl', historyupdateModalInstanceCtrl)
        .controller('historydeleteModalInstanceCtrl', historydeleteModalInstanceCtrl)
        .controller('historyAddModalInstanceCtrl', historyAddModalInstanceCtrl);


    historyupdateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'device_data', 'deviceService'];
    function historyupdateModalInstanceCtrl($scope, $uibModalInstance, device_data, deviceService) {
        $scope.ngModalInputs = angular.copy(device_data);

        //angular typeahead
        deviceService.getDeviceManagementData('todo/deviceHistory/query/deviceowner')
            .then(function (response) {
                $scope.device_owner = [];

                response.data.map(function (item) {
                    $scope.device_owner.push(item.device_owner);
                });

            }, function (err) {
                console.log('error ',err);
            });
        deviceService.getDeviceManagementData('todo/deviceHistory/query/bywhom')
            .then(function (response) {
                $scope.by_whom = [];

                response.data.map(function (item) {
                    $scope.by_whom.push(item.by_whom);
                });

            }, function (err) {
                console.log('error ',err);
            });
        

        $scope.ok = function () {
            $uibModalInstance.close($scope.ngModalInputs);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    historydeleteModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items'];
    function historydeleteModalInstanceCtrl($scope, $uibModalInstance, items) {
        $scope.items = items;
        $scope.ok = function () {
            $uibModalInstance.close($scope.items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    historyAddModalInstanceCtrl.$inject = ['$scope','$uibModalInstance'];
    function historyAddModalInstanceCtrl($scope, $uibModalInstance) {
        //initialize ngMOdalInputs with empty values
        $scope.ngModalInputs = {
            history_date: null,
            device_sn: null,
            device_action: null,
            by_whom: null,
            status: null,
            device_owner: null,
            replace_device: null,
            replaced_device_sn : null,
            note: null
        };

        $scope.ok = function () {
            //validation on front-end//////////////
            var error = [];
            //check history data
            if( $scope.ngModalInputs.history_date == null){
                $scope.history_date_style = {'background-color': '#f2dede'};
                error.push('History Date required ');
            }
            else if($scope.ngModalInputs.history_date == undefined) {
                $scope.history_date_style = {'background-color': '#f2dede'};
                error.push('History Date must be in format yyyy-MM-dd');
            }
            //check device SN
            if($scope.ngModalInputs.device_sn == null){
                error.push('device SN is required');
                $scope.device_sn_style = {'background-color': '#f2dede'};
            }
             else if($scope.ngModalInputs.device_sn.match(/\d/g).length != 7){
                $scope.replaced_device_sn_style = {'background-color': '#f2dede'};
                error.push('Replaced Device SN must be 7 digits');
            }
               //check replaced device SN
            if($scope.ngModalInputs.replace_device == 'Y' && $scope.ngModalInputs.replaced_device_sn == null ){
                $scope.replaced_device_sn_style = {'background-color': '#f2dede'};
                error.push('Replaced Device SN is required');
            }
            else if($scope.ngModalInputs.replaced_device_sn != null && $scope.ngModalInputs.replaced_device_sn.match(/\d/g).length !=7){
                $scope.replaced_device_sn_style = {'background-color': '#f2dede'};
                error.push('Replaced Device SN must be 7 digits');
            }

            ////////////////////////////////////////////////////
            $scope.error = error.join(';  ');
            if ($scope.error){
                $scope.showAlert = true;
            }
            else {
                $scope.showAlert = false;
                $uibModalInstance.close($scope.ngModalInputs);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };  
    }


    deviceHistoryController.$inject = ['deviceService', '$filter', 'NgTableParams', '$uibModal', '$log'];
    function deviceHistoryController(deviceService, $filter, NgTableParams, $uibModal, $log) {
        var historyCtrl = this;

        //set alert//
        historyCtrl.show = false;
        historyCtrl.closeAlert = function () {
            historyCtrl.show = false;
        };

///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('todo/device_history/queryall').then(function (response) {
            historyCtrl.tableParams = new NgTableParams({
                page: 1      // show first page

            }, {
                dataset: response.data // length of data
            });

        }, function (error) {
            console.log('query failed');
        });

        //edit selected table data
        historyCtrl.showModal = function (row, size) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop: 'static',
                keyboard: false,
                size: size,
                templateUrl: 'src/public/device-history/device-history-modal.html',
                controller: 'historyupdateModalInstanceCtrl',
                resolve: {
                    device_data: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('todo/device_history/update', inputs)
                    .then(function (response) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'update success';
                    }, function (error) {
                        console.log('failed to update');
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg = 'update failed!!!';
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        ///delete data
        historyCtrl.deleteModal = function (row) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-history/device-history-delete-modal.html',
                controller: 'historydeleteModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (input) {
                deviceService.postDeviceManagementData('todo/device_history/delete/:_id', input)
                    .then(function (response) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'delete success';
                    }, function (error) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg = 'delete failed!!!';
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        ///add new data
        historyCtrl.create_history_data = function (size) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: size,
                backdrop: 'static',
                templateUrl: 'src/public/device-history/add-device-history-modal.html',
                controller: 'historyAddModalInstanceCtrl'
            });
            modalInstance.result.then(function (input) {
                console.log('input ', input);
                deviceService.postDeviceManagementData('todo/device_history/insert', input)
                    .then(function (response) {
                        console.log('test');
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'add success';
                        console.log('response',response);
                    }, function (error) {
                        historyCtrl.error = error.data.message;
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg = 'add failed!!!';
                        console.log('error',error);
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        }
    }

})();
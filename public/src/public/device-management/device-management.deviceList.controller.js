/**
 * Created by hhe on 3/14/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('showDeviceDataController', showDeviceDataController)
        .controller('deviceUpdateModalInstanceCtrl', deviceUpdateModalInstanceCtrl)
        .controller('deviceDeleteModalInstanceCtrl', deviceDeleteModalInstanceCtrl)
        .controller('deviceAddModalInstanceCtrl', deviceAddModalInstanceCtrl);

    deviceUpdateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'device_data', '$filter', 'deviceService'];
    function deviceUpdateModalInstanceCtrl($scope, $uibModalInstance, device_data, $filter, deviceService) {
        $scope.ngModalInputs = angular.copy(device_data);

        //format date
        $scope.ngModalInputs.registration_date = $filter('date')($scope.ngModalInputs.registration_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.wyless_provision_date = $filter('date')($scope.ngModalInputs.wyless_provision_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.device_test_date = $filter('date')($scope.ngModalInputs.device_test_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.device_suspension_date = $filter('date')($scope.ngModalInputs.device_suspension_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.checked_out_date = $filter('date')($scope.ngModalInputs.checked_out_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.checked_in_date = $filter('date')($scope.ngModalInputs.checked_in_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.lease_start_date = $filter('date')($scope.ngModalInputs.lease_start_date, 'yyyy-MM-dd');
        $scope.ngModalInputs.lease_end_date = $filter('date')($scope.ngModalInputs.lease_end_date, 'yyyy-MM-dd');

       deviceService.getDeviceManagementData('todo/deviceList/query/clinics')
           .then(function (response) {
               $scope.parent_clinics = [];
               $scope.sub_clinics = [];
               $scope.physicians = [];

               response.data.map(function (item) {
                   $scope.parent_clinics.push(item.parent_clinic);
                   $scope.sub_clinics.push(item.parent_clinic);
                   $scope.physicians.push(item.parent_clinic);
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
    deviceDeleteModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items'];
    function deviceDeleteModalInstanceCtrl($scope, $uibModalInstance, items) {
        $scope.items = items;
        $scope.ok = function () {
            $uibModalInstance.close($scope.items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    deviceAddModalInstanceCtrl.$inject = ['$scope','$uibModalInstance','deviceService'];
    function deviceAddModalInstanceCtrl($scope, $uibModalInstance, deviceService) {
        //initialize ngMOdalInputs with empty values
        $scope.ngModalInputs = {};
        var names = deviceService.getDeviceManagementColumns();
        for(var i=0; i<names.length; i++){
            $scope.ngModalInputs[names[i]] = null;
        }

        //angular typeahead
        deviceService.getDeviceManagementData('todo/deviceList/query/clinics')
            .then(function (response) {
                $scope.parent_clinics = [];
                $scope.sub_clinics = [];
                $scope.physicians = [];

                response.data.map(function (item) {
                    $scope.parent_clinics.push(item.parent_clinic);
                    $scope.sub_clinics.push(item.sub_clinic);
                    $scope.physicians.push(item.physician);
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



    showDeviceDataController.$inject = ['deviceService', 'NgTableParams', '$uibModal', '$log'];
    function showDeviceDataController(deviceService, NgTableParams, $uibModal, $log) {
        var deviceList = this;
        //show modal
        deviceList.showModal = function (row, size) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop: 'static',
                keyboard: false,
                size: size,
                templateUrl: 'src/public/device-management/device-update-modal.html',
                controller: 'deviceUpdateModalInstanceCtrl',
                resolve: {
                    device_data: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('todo/device_management/update', inputs)
                    .then(function (response) {
                        console.log('test success');
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'update success';
                    }, function (error) {
                        console.log('failed to update');
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = 'update failed!!!';
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        ///delete data
        deviceList.deleteModal = function (row) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-management/device-delete-modal.html',
                controller: 'deviceDeleteModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (input) {
                deviceService.postDeviceManagementData('todo/device_management/delete', input)
                    .then(function (response) {
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'delete success';
                    }, function (error) {
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = 'delete failed!!!';
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };
        // post inserted data into server
        deviceService.getDeviceManagementData('todo/queryall')
            .then(function (response) {
                deviceList.tableParams = new NgTableParams({
                    page: 1
                }, {
                    dataset: response.data // length of data
                });
            }, function (response) {
                console.log('failed to get device management data');
            });

        ///add new data
        deviceList.createNew = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'lg',
                backdrop: 'static',
                templateUrl: 'src/public/device-management/device-insert-modal.html',
                controller: 'deviceAddModalInstanceCtrl'
            });
            modalInstance.result.then(function (input) {
                console.log('input ', input);
                deviceService.postDeviceManagementData('todo/device_management/insert', input)
                    .then(function (response) {
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'add success';
                        console.log('response',response);
                    }, function (error) {
                        deviceList.error = error.data.message;
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = 'add failed!!!';
                        console.log('error',error);
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };
    }

})();
(function() {
    "use strict";

    angular.module("device").run(configureDefaults);
    configureDefaults.$inject = ["ngTableDefaults"];

    function configureDefaults(ngTableDefaults) {
        // ngTableDefaults.params.count = 50;
        // ngTableDefaults.settings.counts = [];
    }
})();

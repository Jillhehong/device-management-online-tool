/**
 * Created by hhe on 3/14/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('showDeviceDataController', showDeviceDataController)
        .controller('deviceUpdateModalInstanceCtrl', deviceUpdateModalInstanceCtrl) //model for updating
        .controller('deviceDeleteModalInstanceCtrl', deviceDeleteModalInstanceCtrl) //model for deleting
        .controller('deviceAddModalInstanceCtrl', deviceAddModalInstanceCtrl);  //model for inserting

    deviceUpdateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'device_data', '$filter', 'deviceService'];
    function deviceUpdateModalInstanceCtrl($scope, $uibModalInstance, device_data, $filter, deviceService) {
        $scope.ngModalInputs = angular.copy(device_data);

        //format date in ng-model
        Object.keys($scope.ngModalInputs).map(function (key) {
            if(key.indexOf('date') >-1){
                $scope.ngModalInputs[key] = $filter('date')($scope.ngModalInputs[key], 'yyyy-MM-dd');
            }
        });

       deviceService.getDeviceManagementData('/todo/device_management/query/clinics')
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

        //for ng-options in <select>
        $scope.model_description = [
            'Aera CT 2G',
            'Aera CT 3G'
        ];
        $scope.firmware_version = [
            'V2.8',
            'V2.7',
            'V2.6',
            'V2.5'
        ];
        $scope.manufacturer = [
            'TZ Medical'
        ];
        $scope.points_to = [
            'AWS-Prod',
            'AWS-Dev'
        ];
        $scope.YesOrNo = [
            'Y',
            'N'
        ];
        $scope.sim_provider = [
            'AT&T',
            'Wyless AT&T',
            'Wyless T-Mobile'
        ];
        $scope.status=[
            "Beta Site",
            "Clinical Trials",
            "Customer",
            "Decommissioned",
            "Defective",
            "Inventory-Active",
            "Inventory-Inactive",
            "Inventory-Suspended",
            "Refurbished",
            "RMA",
            "Sales - Out",
            "Development",
            "Sales Demo",
            "Troubleshooting",
            "SIM Switch",
            "Lost"
        ];
        $scope.location=[
            'Drawer1-Active',
            'Drawer2-Accessory',
            'Drawer3-Suspended',
            'Drawer4-Inactive(Misc)',
            'Device-Out-RMA',
            'Device-Out-Others',
            'Development',
            'Shelf-A-pre-order',
            'Shelf-B-pre-order',
            'Shelf-C-pre-order',
            'Shelf-D-pre-order'
        ];
        $scope.checked_out_by=[
            'Alex Armstrong',
            'Emir Muhovic',
            'Latha Ganeshan',
            'Sameer Adumala',
            'Steve Rode'
        ];
        
        //confirm model
        $scope.ok = function () {
            $uibModalInstance.close($scope.ngModalInputs);
        };
        //dismiss model
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    deviceDeleteModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items','$filter'];
    function deviceDeleteModalInstanceCtrl($scope, $uibModalInstance, items, $filter) {
        //manipulate key in obj(key, value)
        var newItems={};
        Object.keys(items).map(function (key) {
            var data = key.replace(/_/g, ' ');
            newItems[data] = items[key];

            //format date
            if(data.indexOf('date') >-1){
                newItems[data] = $filter('date')(newItems[data], 'yyyy-MM-dd');
            }
        });
        $scope.items = newItems;

        $scope.ok = function () {
            $uibModalInstance.close(items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    deviceAddModalInstanceCtrl.$inject = ['$scope','$uibModalInstance','deviceService'];
    function deviceAddModalInstanceCtrl($scope, $uibModalInstance, deviceService) {
        //initialize ng-model inputs
        $scope.ngModalInputs = {};
        var names = deviceService.getDeviceManagementColumns();
        for(var i=0; i<names.length; i++){
            $scope.ngModalInputs[names[i]] = null;
        }

        //for angular typeahead
        deviceService.getDeviceManagementData('/todo/device_management/query/clinics')
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
                backdrop: 'static',  // do not turn off model when click outside of model
                keyboard: false,
                size: size,  //model size
                templateUrl: 'src/public/device-management/device-update-modal.html',
                controller: 'deviceUpdateModalInstanceCtrl',
                resolve: {
                    device_data: function () {
                        return row;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('/todo/device_management/update', inputs)
                    .then(function (response) {
                        //show alert msg
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'update success';
                    }, function (error) {
                        console.log('failed to update');
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = error.data.message;
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
                deviceService.postDeviceManagementData('/todo/device_management/delete', input)
                    .then(function (response) {
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'The new data has been deleted successfully';
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
        deviceService.getDeviceManagementData('/todo/device_management/queryall')
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
                deviceService.postDeviceManagementData('/todo/device_management/insert', input)
                    .then(function (response) {
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'The new data has been added successfully';
                        console.log('response',response);
                    }, function (error) {
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = error;
                        console.log('error',error);
                    });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };
    }

})();
// (function() {
//     "use strict";
//
//     angular.module("device").run(configureDefaults);
//     configureDefaults.$inject = ["ngTableDefaults"];
//
//     function configureDefaults(ngTableDefaults) {
//         // ngTableDefaults.params.count = 50;
//         // ngTableDefaults.settings.counts = [];
//     }
// })();

(function () {
    "use strict";

    angular.module('device')
        .controller('showDeviceDataController', showDeviceDataController)
        .controller('deviceUpdateModalInstanceCtrl', deviceUpdateModalInstanceCtrl) //model for updating
        .controller('deviceDeleteModalInstanceCtrl', deviceDeleteModalInstanceCtrl) //model for deleting
        .controller('deviceAddModalInstanceCtrl', deviceAddModalInstanceCtrl)  //model for inserting
        .controller('deviceDetailCtrl', deviceDetailCtrl);  //model for seeing device detail


    deviceDetailCtrl.$inject = ['$scope','$uibModalInstance', '$filter', 'details'];
    function deviceDetailCtrl($scope, $uibModalInstance, $filter, details){
        $scope.item= details;
        
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    }

    deviceUpdateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', '$filter', 'deviceService','device_data', 'options'];
    function deviceUpdateModalInstanceCtrl($scope, $uibModalInstance, $filter, deviceService, device_data,options) {
        $scope.ngModalInputs = angular.copy(device_data);
        //format date in ng-model
        Object.keys($scope.ngModalInputs).map(function (key) {
            if(key.indexOf('date') >-1){
                $scope.ngModalInputs[key] = $filter('date')($scope.ngModalInputs[key], 'yyyy-MM-dd');
            }
        });

        //selection
        $scope.options = options;

        //angular typeahead
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
        //angular typeahead using $http
        deviceService.getDeviceManagementData('/todo/device_management/query/sales')
            .then(function (response) {
                $scope.salesperson_name = [];
                response.data.map(function (item) {
                    $scope.salesperson_name.push(item.salesperson_name);
                });
            }, function (err) {
                console.log('error ',err);
            });
        
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

    deviceAddModalInstanceCtrl.$inject = ['$scope','$uibModalInstance','deviceService', 'options'];
    function deviceAddModalInstanceCtrl($scope, $uibModalInstance, deviceService, options) {
        //initialize ng-model inputs
        $scope.ngModalInputs = {};
        var names = deviceService.getDeviceManagementColumns();
        for(var i=0; i<names.length; i++){
            $scope.ngModalInputs[names[i]] = null;
        }

        //angular selection
        $scope.options = options;

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



    showDeviceDataController.$inject = ['deviceService', 'NgTableParams', '$uibModal'];
    function showDeviceDataController(deviceService, NgTableParams, $uibModal) {
        var deviceList = this;

        //define variables for select options
        //for ng-options in <select>
        deviceList.options = {
            model_description: ['Aera CT 2G', 'Aera CT 3G'],
            firmware_version: [ 'V2.8','V2.7','V2.6','V2.5'],
            manufacturer: ['TZ Medical'],
            points_to: ['AWS-Prod', 'AWS-Dev'],
            YesOrNo: ['Y','N'],
            sim_provider: [ 'AT&T', 'Wyless AT&T', 'Wyless T-Mobile'],
            salesteam: ['Zywie','eLab Solutions','Health Fusion distributor'],
            status: [
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
            ],
            location: [
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
            ],
            checked_by: [ 'Alex Armstrong', 'Emir Muhovic', 'Latha Ganeshan','Sameer Adumala','Steve Rode']
        };

        //set color based on device status
        deviceList.set_color = function (item) {
            if(item == 'Inventory-Active')  {
                return {"background-color": "#2ECC71", color:'white'}
            }
            else if(item == 'Inventory-Suspended')  {
                return {"background-color": "gray", color:'white'}
            }
            else if(item == 'Inventory-Inactive')  {
                return {"background-color": "#7AA5BF", color:'white'}
            }
            else if(item == 'Customer')  {
                return {"background-color": "#F1C40F", color:'white'}
            }
            else if(item == 'Sales - Out')  {
                return {"background-color": "#BDC3C7", color:'white'}
            }
            else if(item == 'RMA')  {
                return {"background-color": "#E20934",color:'white'}
            }

        };
        
        //show device edit modal
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
                    },
                    options: function () {
                        return deviceList.options;
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
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = error.data.message;
                    });
            }, function () {
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
            }, function (err) {
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
                controller: 'deviceAddModalInstanceCtrl',
                resolve: {
                    options: function () {
                        return deviceList.options;
                    }
                }
            });
            modalInstance.result.then(function (input) {
                deviceService.postDeviceManagementData('/todo/device_management/insert', input)
                    .then(function (response) {
                        deviceList.show = true;
                        deviceList.type = 'alert-success';
                        deviceList.msg = 'The new data has been added successfully';
                    }, function (error) {
                        deviceList.show = true;
                        deviceList.type = 'alert-danger';
                        deviceList.msg = error.data;
                    });

            }, function () {
            });
        };
        //show device detail
        deviceList.showDeviceDetail = function (item) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'lg',
                backdrop: 'static',
                templateUrl: 'src/public/device-management/deviceDetail.html',
                controller: 'deviceDetailCtrl',
                resolve: {
                    details: function () {
                        return item;
                    }
                }
            });
        }
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

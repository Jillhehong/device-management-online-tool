(function () {
    "use strict";

    angular.module('device')
        .controller('deviceHistoryController', deviceHistoryController)
        .controller('historyupdateModalInstanceCtrl', historyupdateModalInstanceCtrl)
        .controller('historydeleteModalInstanceCtrl', historydeleteModalInstanceCtrl)
        .controller('historyAddModalInstanceCtrl', historyAddModalInstanceCtrl);


    historyupdateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'device_data','options', 'deviceService', '$filter'];
    function historyupdateModalInstanceCtrl($scope, $uibModalInstance, device_data, options, deviceService, $filter) {
        $scope.ngModalInputs = angular.copy(device_data);
        //format date
        $scope.ngModalInputs.history_date = $filter('date')($scope.ngModalInputs.history_date, 'yyyy-MM-dd');
        
        //angular selection
        $scope.options = options;
        
        //angular typeahead
        deviceService.getDeviceManagementData('/todo/deviceHistory/query/deviceowner')
            .then(function (response) {
                $scope.device_owner = [];
                response.data.map(function (item) {
                    $scope.device_owner.push(item.device_owner);
                });

            }, function (err) {
                console.log('error ',err);
            });
        deviceService.getDeviceManagementData('/todo/deviceHistory/query/bywhom')
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
    historyAddModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'options','deviceService'];
    function historyAddModalInstanceCtrl($scope, $uibModalInstance, options, deviceService) {
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

        //
        //angular typeahead
        deviceService.getDeviceManagementData('/todo/deviceHistory/query/deviceowner')
            .then(function (response) {
                $scope.device_owner = [];
                response.data.map(function (item) {
                    $scope.device_owner.push(item.device_owner);
                });

            }, function (err) {
                console.log('error ',err);
            });

        //selection
        $scope.options = options;
        
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


    deviceHistoryController.$inject = ['deviceService', '$filter', 'NgTableParams', '$uibModal'];
    function deviceHistoryController(deviceService, $filter, NgTableParams, $uibModal) {
        var historyCtrl = this;
        
        //select options
        historyCtrl.options = {
        device_action : [
            'Inventory-Inactive',
            'Checked In',
            'Checked Out',
            'Decommissioned',
            'Defective',
            'Return-RMA',
            'Sales Demo'
            ],
         by_whom: [
            'Alex Armstrong',
            'Emir Muhovic',
            'Latha Ganeshan',
            'Sameer Adumala'
            ],
        status : [
            'Beta Site',
            'Clinical Trials',
            'Customer',
            'Decommissioned',
            'Defective',
            'Inventory-Active',
            'Inventory-Inactive',
            'Inventory-Suspended',
            'Refurbished',
            'RMA',
            'Sales - Out',
            'Development',
            'Sales Demo',
            'Troubleshooting',
            'SIM Switch',
            'Lost'
        ],
            YesOrNo : [
            'Y',
            'N'
        ]
        };

        //set alert//
        historyCtrl.show = false;
        historyCtrl.closeAlert = function () {
            historyCtrl.show = false;
        };

        //set color based on device status
        historyCtrl.set_color = function (item) {
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

///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('/todo/device_history/queryall').then(function (response) {
            historyCtrl.tableParams = new NgTableParams({
                page: 1      // show first page

            }, {
                dataset: response.data // length of data
            });

        }, function (error) {
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
                    },
                    options: function () {
                        return historyCtrl.options;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('/todo/device_history/update', inputs)
                    .then(function (response) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'update success';
                    }, function (error) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg ='failed update. Error: '+error.data;
                    });

            }, function () {
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
                deviceService.postDeviceManagementData('/todo/device_history/delete/:_id', input)
                    .then(function (response) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'delete success';
                    }, function (error) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg = 'failed error: '+ error.data;
                    });

            }, function () {
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
                controller: 'historyAddModalInstanceCtrl',
                resolve: {
                    options: function () {
                        return historyCtrl.options;
                    }
                }
            });
            modalInstance.result.then(function (input) {
                deviceService.postDeviceManagementData('/todo/device_history/insert', input)
                    .then(function (response) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-success';
                        historyCtrl.msg = 'add success';
                    }, function (error) {
                        historyCtrl.show = true;
                        historyCtrl.type = 'alert-danger';
                        historyCtrl.msg = 'failed error: ' + error.data;
                    });

            }, function () {
            });

        }
    }

})();
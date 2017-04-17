/**
 * Created by hhe on 3/12/2017.
 */

(function () {
    "use strict";

    angular.module('device')
        .controller('deviceManagementQueryController', deviceManagementQueryController)
        .controller('updateModalInstanceCtrl', updateModalInstanceCtrl)
        .controller('deleteModalInstanceCtrl', deleteModalInstanceCtrl);

    updateModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items'];
    deleteModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items', 'labels'];

    function updateModalInstanceCtrl($scope, $uibModalInstance, items) {
        $scope.ngModalInputs = angular.copy(items);

        //convert object into array
        // $scope.ngModelinputs = Object.keys(items).map(function (key) { return items[key]; });
        // console.log($scope.ngModelinputs);

        $scope.ok = function () {
            $uibModalInstance.close($scope.ngModalInputs);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    function deleteModalInstanceCtrl($scope, $uibModalInstance, items, labels) {
        $scope.labels = labels;

        //convert object to array
        $scope.items = Object.keys(items).map(function (key) {
            return items[key];
        });

        $scope.ok = function () {
            $uibModalInstance.close(items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    deviceManagementQueryController.$inject = ['deviceService', '$timeout','$uibModal', '$log'];
    function deviceManagementQueryController(deviceService, $timeout, $uibModal, $log) {
        var queryCtrl = this;

        ///remove underscore from table column names
        var strings = deviceService.getDeviceManagementColumns();
        queryCtrl.tableColumns = [];
        for(var i=0;i<strings.length;i++){
            queryCtrl.tableColumns.push(strings[i].replace(/_/g, ' '));
        }
////////////////////////set alerts////////////////
        queryCtrl.show = false;
        queryCtrl.closeAlert = function () {
            queryCtrl.show = false;
        };
        ////set query result on/off
        queryCtrl.queryResult = false;

        //query
        queryCtrl.query = {};
        queryCtrl.search = function () {
          deviceService.postDeviceManagementData('/todo/deviceList/query', queryCtrl.query)
              .then(function (response) {
                  if(response.data.length){
                      queryCtrl.results = response.data;
                  }
                  else {
                      queryCtrl.queryResult = true;
                  }
              }, function (error) {
                  console.log('failed to query');
              });
        };
        
///////////////////show modal///////////////        
        queryCtrl.showModal = function (index, size) {

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                backdrop  : 'static',
                keyboard  : false,
                size: size,
                templateUrl: 'src/public/device-management/device-update-modal.html',
                controller: 'updateModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return queryCtrl.results[index];
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('/todo/update', inputs).
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
                deviceService.postDeviceManagementData('/todo/delete/:_id', input)
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
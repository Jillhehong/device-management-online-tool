/**
 * Created by hhe on 3/9/2017.
 */
(function () {
    "use strict";
    angular.module('device')
        .controller('deviceManagementInsertController', deviceManagementInsertController)
        .controller('insertModalInstanceCtrl', insertModalInstanceCtrl);

    insertModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'items', 'labels'];
    function insertModalInstanceCtrl($scope, $uibModalInstance, items, labels ) {
        $scope.items = items;
        $scope.labels =labels;
        
        $scope.ok = function () {
            $uibModalInstance.close($scope.items);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
    
    deviceManagementInsertController.$inject = ['deviceService', '$uibModal', '$log'];
    function deviceManagementInsertController(deviceService, $uibModal, $log) {
        var insertCtrl = this;
        
////set alert//////
        insertCtrl.show = false;
        insertCtrl.closeAlert = function () {
            insertCtrl.show = false;
        };
        
///////get table column names//////
//         format tablecolumns to remove underscore
        var strings = deviceService.getDeviceManagementColumns();
        insertCtrl.tableColumns = [];
        for(var i=0;i<strings.length;i++){
            insertCtrl.tableColumns.push(strings[i].replace(/_/g, ' '));
        }

/////////define insert values for device management table/////////
        insertCtrl.reg = new Array(insertCtrl.tableColumns.length);
        
        // post inserted data into server
        insertCtrl.submit = function () {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'src/public/device-management/device-insert-modal.html',
                controller: 'insertModalInstanceCtrl',
                resolve: {
                    labels: function () {
                        return insertCtrl.tableColumns;
                    },
                    items: function () {
                        return insertCtrl.reg;
                    }
                }
            });
            modalInstance.result.then(function (inputs) {
                deviceService.postDeviceManagementData('todo/insert', {data: inputs})
                    .then(function (response) {
                        insertCtrl.show = true;
                        insertCtrl.type = 'alert-success';
                        insertCtrl.msg = 'insert success';
                    }, function (error) {
                        console.log('error', error);
                        insertCtrl.show = true;
                        insertCtrl.msg = error;
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

    }


})();

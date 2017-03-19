
(function () {
    "use strict";

    angular.module('device')
        .controller('deviceInventoryController', deviceInventoryController);


    deviceInventoryController.$inject = ['deviceService', '$timeout','$uibModal', '$log'];
    function deviceInventoryController(deviceService, $timeout, $uibModal, $log) {
        var inventoryCtrl = this;
        inventoryCtrl.tableColumns = deviceService.getInventoryColumns();
        //// alert////
        inventoryCtrl.show = false;



///////////////get data from http request from device_management table///////////
        deviceService.getDeviceManagementData('todo/device_inventory/queryall').then(function (response) {
            console.log('query success');
            inventoryCtrl.results = response.data;
            inventoryCtrl.inputs = angular.copy(inventoryCtrl.results);


            ///disable all input//////
            inventoryCtrl.cutoff = new Array();
            for(var i=0;i<inventoryCtrl.results.length;i++){
                inventoryCtrl.cutoff[i] = true;
            }

        }, function (error) {
            console.log('query failed');
        });



//////////////// edit function///////
        inventoryCtrl.edit = function (index) {
            /////enable selected inputs in the data///
            inventoryCtrl.cutoff[index]=false;
        };


////////////save  function//////////
        inventoryCtrl.save = function (index) {
            var data = [
                inventoryCtrl.inputs[index].received_date,
                inventoryCtrl.inputs[index].order_id,
                inventoryCtrl.inputs[index].purchase_order,
                inventoryCtrl.inputs[index].manufactuer,
                inventoryCtrl.inputs[index].item,
                inventoryCtrl.inputs[index].order_quantity,
                inventoryCtrl.inputs[index].received_quantity,
                inventoryCtrl.inputs[index].deficiency_quantity,
                inventoryCtrl.inputs[index].deficiency_received_date,
                inventoryCtrl.inputs[index].shipping_status,
                inventoryCtrl.inputs[index].device_sn,
                inventoryCtrl.inputs[index].package_content,
                inventoryCtrl.inputs[index].purchase_order
            ];

            
            ///////post edited data///////
            deviceService.postDeviceManagementData('todo/device-inventory/update', {data: data})
                .then(function (response) {
                console.log('inventory update success');
                    inventoryCtrl.show = true;
                    inventoryCtrl.type = 'alert-success';
                    inventoryCtrl.msg = 'update success';
                
            }, function (err) {
                console.log('inventory update failed');
                    inventoryCtrl.show = true;
                    inventoryCtrl.type = 'alert-danger';
                    inventoryCtrl.msg = 'update failed!!!';
            });


        };







////////////////delete functition///////
        inventoryCtrl.delete = function (index) {

        };




        
//////////////delete selected data///////////////////
//         queryCtrl.deleteModal = function (index) {
//             var modalInstance = $uibModal.open({
//                 ariaLabelledBy: 'modal-title',
//                 ariaDescribedBy: 'modal-body',
//                 templateUrl: 'src/public/device-management/device-delete-modal.html',
//                 controller: 'deleteModalInstanceCtrl',
//                 resolve: {
//                     labels: function () {
//                         return queryCtrl.tableColumns;
//                     },
//                     items: function () {
//                         return queryCtrl.results[index];
//                     }
//                 }
//             });
//             modalInstance.result.then(function (input) {
//                 // get device_sn value
//                 var device_sn = input.device_sn;
//                 console.log(input.device_sn);
//                 //////////
//                 deviceService.postDeviceManagementData('todo/delete/:_id', {data:[device_sn]})
//                     .then(function (response) {
//                         queryCtrl.show = true;
//                         queryCtrl.type = 'alert-success';
//                         queryCtrl.msg = 'delete success';
//                     }, function (error) {
//                         queryCtrl.show = true;
//                         queryCtrl.type = 'alert-danger';
//                         queryCtrl.msg = 'delete failed!!!';
//                     });
//
//             }, function () {
//                 $log.info('Modal dismissed at: ' + new Date());
//             });

        // };
    }
})();
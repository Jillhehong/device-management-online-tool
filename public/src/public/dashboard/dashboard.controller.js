(function () {
    'use strict';
    angular.module('device')
        .controller('dashboardController',dashboardController);

    dashboardController.$inject = ['deviceService'];
    function dashboardController(deviceService) {
        var dashboardCtrl = this;

        //get data from device_inventory_test table
        deviceService.getDeviceManagementData('/todo/dashboard/totalDevices')
            .then(function (response) {
                dashboardCtrl.results = response.data[0];
            }, function (error) {
                console.log(error);
            });

        //get available devices from device_management_test
        deviceService.getDeviceManagementData('/todo/dashboard/availableDevices')
            .then(function (response) {
                //count billable devices
                dashboardCtrl.deviceCounts = 0;
                var billable = 0;
                var unbillable =0;
                angular.forEach(response.data, function (value, key) {
                    //count available devices if available in inventory
                    if(value.location == 'Drawer1-Active' ||
                        value.location == 'Drawer3-Suspended' ||
                        value.location == 'Drawer4-Inactive(Misc)') {
                        dashboardCtrl.deviceCounts ++;
                    }

                    //count billable devices
                    if(value.billable =='Y'){
                        billable ++;
                    }
                        //count non-billable devices
                    else if(value.billable=='N'){
                        unbillable ++;
                    }
                });
                dashboardCtrl.pie = {
                    labels: ["billable", "unbillable"],
                    data: [billable, unbillable],
                    colors:[ '#82C456','#D3D3D3'], //set color
                    options:{
                        legend:{
                            display:true,
                            position:'bottom'
                        },
                        title: {
                          display: true,
                          fontSize: 16,
                          text: 'billable vs Non-billable devices'
                        }
                        // responsive: false
                    }
                };
            }, function (error) {
                console.log(error);
            });
        
        //get device status
        deviceService.getDeviceManagementData('/todo/dashboard/device_status')
            .then(function(response){
                dashboardCtrl.bar_status = {
                    labels:[],
                    data:[],
                    colors: [],
                    options:{
                        title: {
                            display: true,
                            fontSize: 16,
                            text: 'Device Status'
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
                        }
                    }
                };
                //angular.forEach() to iterate through array/obj
                angular.forEach(response.data, function (value, key) {
                    dashboardCtrl.bar_status.labels.push(value.status);
                    dashboardCtrl.bar_status.data.push(value.count);
                    dashboardCtrl.bar_status.colors.push('#5E7EE4');
                });
            }, function (error) {
                console.log('error ', error);
            });
        
        //get device location
        deviceService.getDeviceManagementData('/todo/dashboard/device_location')
            .then(function(response){
                dashboardCtrl.bar_location = {
                    labels:[],
                    data:[],
                    colors: [],
                    options:{
                        title: {
                            display: true,
                            fontSize: 16,
                            text: 'Device Location'
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
                        }
                        // animation: {
                        //     duration: 1,
                        //     onComplete: function(animation) {
                        //         var chartInstance = this.chart,
                        //             ctx = chartInstance.ctx;
                        //         ctx.textAlign = 'center';
                        //         ctx.fillStyle = "rgba(0, 0, 0, 1)";
                        //         ctx.textBaseline = 'bottom';
                        //
                        //         this.data.datasets.forEach(function (dataset, i) {
                        //             var meta = chartInstance.controller.getDatasetMeta(i);
                        //             meta.data.forEach(function (bar, index) {
                        //                 var data = dataset.data[index];
                        //                 ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        //
                        //             });
                        //         })
                        //         console.log('this ', ctx);
                        //     }
                        // }
                    }
                };
                //angular.forEach()
                angular.forEach(response.data, function (value, key) {
                    dashboardCtrl.bar_location.labels.push(value.location);
                    dashboardCtrl.bar_location.data.push(value.count);
                    dashboardCtrl.bar_location.colors.push('#5E7EE4');

                });

            }, function (error) {
                console.log('error ', error);
            });
        //get purchase orders
        deviceService.getDeviceManagementData('/todo/dashboard/device_purchase_order')
            .then(function(response){
                dashboardCtrl.bar = {
                    labels:[],
                    series:['Order Quantity','Received Quantity','Deficiency Quantity'],
                    data:[],
                    colors: [
                        {
                            backgroundColor: '#5E7EE4'
                        },
                        {
                            backgroundColor: '#AD2E39'
                        },
                        {
                            backgroundColor: '#82C456'
                        }
                    ],
                    options: {
                        title: {
                            display: true,
                            fontSize: 16,
                            text: 'Purchase Order History'
                        },
                        legend:{
                          display:true,
                           position:'right'
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                }
                            }]
                        },
                        maintainAspectRatio: false
                    }
                };
                var data1=[],data2=[],data3=[];
                angular.forEach(response.data, function (value, key) {
                    dashboardCtrl.bar.labels.push(value.purchase_order);
                    data1.push(value.order_quantity);
                    data2.push(value.received_quantity);
                    data3.push(value.deficiency_quantity);
                });
                dashboardCtrl.bar.data =[
                    data1,
                    data2,
                    data3
                ];
                
            }, function (error) {
                console.log('error ', error);
            });

        //get customer names
        deviceService.getDeviceManagementData('/todo/dashboard/customers')
            .then(function (response) {
                dashboardCtrl.customersData = response.data;

                //calculate grand total
                dashboardCtrl.totalCustomers = 0;
                angular.forEach(response.data, function (value, key) {
                    dashboardCtrl.totalCustomers = dashboardCtrl.totalCustomers + parseInt(value.count);
                });
            }, function (err) {
                console.log('error ', err);
            });
        //get sub clinics under Heart Smart, Inc
        deviceService.getDeviceManagementData('/todo/dashboard/customers/HIS')
            .then(function (response) {
                dashboardCtrl.heartSmartData = response.data;

                //calculate grand total
                dashboardCtrl.totalUnderHIS = 0;
                angular.forEach(response.data, function (value, key) {
                    dashboardCtrl.totalUnderHIS = dashboardCtrl.totalUnderHIS + parseInt(value.count);
                });
            }, function (err) {
                console.log('error ', err);
            });
    }
})();
/**
 * Created by hhe on 3/14/2017.
 */
(function () {
    "use strict";

    angular.module('device')
        .controller('showDeviceDataController', showDeviceDataController);

        showDeviceDataController.$inject = ['deviceService', '$filter', 'NgTableParams'];
        function showDeviceDataController(deviceService, $filter, NgTableParams) {
            var deviceList = this;

            var values = deviceService.getDeviceManagementColumns();
            deviceList.cols = [];
            //populate table header names
            for (var i = 0; i < values.length; i++) {
                    deviceList.cols.push({field: values[i], title: values[i], sortable: values[i], show: true});

            }

            // post inserted data into server
            deviceService.getDeviceManagementData('todo/queryall')
                .then(function (response) {
                    deviceList.data = response.data;
                    deviceList.tableParams = new NgTableParams({
                        page: 1,            // show first page
                        count: 10, // count per page
                        sorting: {
                            col_number: 'asc'     // initial sorting
                        }
                    }, {
                        dataset: deviceList.data // length of data
                    });

                }, function (response) {
                    alert('insert failed');
                });

        }

})();
(function() {
    "use strict";

    angular.module("device").run(configureDefaults);
    configureDefaults.$inject = ["ngTableDefaults"];

    function configureDefaults(ngTableDefaults) {
        ngTableDefaults.params.count = 5;
        ngTableDefaults.settings.counts = [];
    }
})();

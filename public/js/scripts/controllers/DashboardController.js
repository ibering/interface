angular.module('Statusengine')

    .controller("DashboardController", function ($http, $interval, $scope, ReloadService) {

        $scope.initializing = true;
        $scope.oldData = null;

        var notify = function (number, objectType, state, type) {
            noty({
                theme: 'metrouiAdminLTE',
                progressBar: true,
                layout: 'topRight',
                type: type, // success, error, warning, information, notification
                text: String(number) + ' ' + objectType + ' changed to state ' + state,
                timeout: 2500,
                animation: {
                    open: 'animated flipInX',
                    close: 'animated flipOutX'
                }
            });
        };

        $scope.reload = function () {
            $http.get("/api/index.php").then(function (result) {
                    $scope.data = result.data;
                    if ($scope.oldData) {
                        $scope.notifyNodeStateChange();
                        $scope.notifyServiceStateChange();
                    } else {
                        $scope.initializing = false;
                    }
                    $scope.oldData = result.data;
                }
            );
        };

        $scope.notifyNodeStateChange = function () {
            var number;
            if ($scope.data.hoststatus_overview.down > $scope.oldData.hoststatus_overview.down) {
                number = $scope.data.hoststatus_overview.down - $scope.oldData.hoststatus_overview.down;
                notify(number, 'Nodes', 'Down', 'error');
            }
            if ($scope.data.hoststatus_overview.unreachable > $scope.oldData.hoststatus_overview.unreachable) {
                number = $scope.data.hoststatus_overview.unreachable - $scope.oldData.hoststatus_overview.unreachable;
                notify(number, 'Nodes', 'Unreachable', 'information');
            }
        };

        $scope.notifyServiceStateChange = function () {
            var number;
            if ($scope.data.servicestatus_overview.warning > $scope.oldData.servicestatus_overview.warning) {
                number = $scope.data.servicestatus_overview.warning - $scope.oldData.servicestatus_overview.warning;
                notify(number, 'Services', 'Warning', 'warning');
            }
            if ($scope.data.servicestatus_overview.critical > $scope.oldData.servicestatus_overview.critical) {
                number = $scope.data.servicestatus_overview.critical - $scope.oldData.servicestatus_overview.critical;
                notify(number, 'Services', 'Critical', 'error');
            }
            if ($scope.data.servicestatus_overview.unknown > $scope.oldData.servicestatus_overview.unknown) {
                number = $scope.data.servicestatus_overview.unknown - $scope.oldData.servicestatus_overview.unknown;
                notify(number, 'Services', 'Unknown', 'information');
            }
        };

        $scope.reload();

        ReloadService.enableAutoloadIfRequired();
        ReloadService.setCallback($scope.reload);

    });
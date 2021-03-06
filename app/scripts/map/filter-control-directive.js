/**
 * Control to allow the user to filter by the categories displayed on the cartodb-vis map
 */

(function () {
    'use strict';

    /** @ngInject */
    function FilterController($scope, Config) {
        var layer = null;
        var filterColumn = 'ntee_org_type_new';
        var noneName = 'All';
        var noneValue = {name: noneName, value: null};
        var table = Config.cartodb.tableName;

        var ctl = this;
        initialize();

        function initialize() {
            var options = _.cloneDeep(Config.cartodb.legend.data);
            options.splice(0, 0, noneValue);
            ctl.options = options;
            ctl.filterValue = noneValue;

            ctl.onFilterOptionChanged = onFilterOptionChanged;

            $scope.$on('imls:vis:ready', function (event, viz) {
                layer = viz.getLayers()[1];
            });
        }

        function vizSqlForValue(value) {
            if (value === noneName) {
                return 'SELECT * FROM ' + table;
            } else {
                return 'SELECT * FROM ' + table + ' ' +
                    'WHERE ' + filterColumn + '=\'' + value + '\'';
            }
        }

        function onFilterOptionChanged() {
            setFilterValue(ctl.filterValue.name);
        }

        function setFilterValue(value) {
            var sql = vizSqlForValue(value);
            layer.setQuery(sql);
        }
    }

    /** @ngInject */
    function filterControl() {
        var module = {
            restrict: 'A',
            templateUrl: 'scripts/map/filter-control-partial.html',
            scope: true,
            controller: 'FilterController',
            controllerAs: 'fc',
            bindToController: true
        };
        return module;
    }

    angular.module('imls.map')
    .controller('FilterController', FilterController)
    .directive('vizFilterControl', filterControl);

})();

var motorVehiclesControllers = angular.module('motorVehiclesControllers', []);

motorVehiclesControllers.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.loading = true;
        $scope.pageNumber = 1;
        $scope.state = 'Alabama';
        $scope.intervention = 'Alcohol Interlocks';
        $scope.datasets = ['test/Data_Infographic_Image1-2.csv', 'test/Data_Infographic_Image3-4.csv'];
        $scope.strategies = ['Alcohol Interlocks','Bicycle Helment','In Person Renewal', 'Increased Seat Belt Fine', 'License Plate Impound', 'Limits on Diversion', 'Motorcycle Helmet', 'Primary Enforcement Seat Belt Law', 'Red Light Camera', 'Saturation Patrols', 'Seat Belt Enforcement Campaign', 'Sobriety Checkpoints', 'Speed Camera', 'Vehicle Impoundment'];
        $scope.statecodes = {'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'};
        $scope.embedCode = cdcCommon.runtime.embedCode;
        
        angular.element(window).bind('resize', function() {

        });

        $scope.processData = function(response) {
            var lines = response.data.split('\n');
            var props = lines[0].split(',');

            for (var i = 0; i < props.length; i++) {
                if (props[i]) {
                    props[i] = props[i].trim();
                }
            }

            var values, obj;
            $scope.data = $scope.data || {};
            for (var i = 1; i < lines.length; i++) {
                obj = {};
                values = lines[i].split(',');

                for (var j = 0; j < values.length; j++) {
                    if (props[j]) {
                        switch(props[j]){
                            case 'Unimplemented Interventions (Recommended by MV PICCS)':
                                obj[props[j]] = values[j].split(/[0-9]\./);
                                break;
                            default:
                                obj[props[j]] = values[j].trim();
                                break;
                        }
                    }
                }
                
                if (obj['State']) {
                    if($scope.data[obj['State']]){
                        jQuery.extend($scope.data[obj['State']], obj);
                    } else {
                        $scope.data[obj['State']] = obj;
                    }
                    
                }
            }
            
            
            $scope.waitingFor--;
            if ($scope.waitingFor === 0) {
                console.log($scope.data);
                $scope.loading = false;
                $scope.setIntervention();
                $scope.drawMap();
            }
        };

        $scope.handleError = function() {

        };

        $scope.waitingFor = $scope.datasets.length;
        $scope.datasets.forEach(function(url, index) {
            $http.get(url).then($scope.processData, $scope.handleErr);
        });



        $scope.changePage = function(e) {
            if ($(e.target).hasClass('left-arrow') || e.type === 'swiperight') {
                if ($scope.pageNumber > 1) {
                    $scope.pageNumber--;
                }
            } else if ($(e.target).hasClass('right-arrow') || e.type === 'swipeleft') {
                if ($scope.pageNumber < 5) {
                    $scope.pageNumber++;
                }
            }
            if (e.type === 'swiperight' || e.type === 'swipeleft') {
                $scope.$digest();
            }
        };
        
        $scope.setIntervention = function(){
            for(var i = 0; i < $scope.strategies.length; i++){
                if($scope.data[$scope.state][$scope.strategies[i] + ': Intervention Implemented?'] === 'Yes'){
                    $scope.intervention = $scope.strategies[i];
                    return;
                }
            }
        };

        $scope.drawMap = function() {
            $scope.mapData = {};
            for(state in $scope.data){
                if($scope.data[state][$scope.intervention + ': Intervention Implemented?'] === 'Yes'){
                    $scope.mapData[$scope.statecodes[state]] = {fillKey: 'implemented'};
                }
            }
            
            console.log($scope.mapData);
            $('#map').empty();
            
            $scope.map = new Datamap({
                scope: 'usa',
                element: document.getElementById('map'),
                geographyConfig: {
                    popupOnHover: false,
                    borderWidth: .3,
                    borderColor: 'black'
                },
                fills: {defaultFill: 'khaki', implemented: 'lightblue'},
                data: $scope.mapData
            });
        };

    }]);

motorVehiclesControllers.directive('swipePage', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                $(element).on('swipeleft', scope.changePage);
                $(element).on('swiperight', scope.changePage);
            }
        };
    }]);
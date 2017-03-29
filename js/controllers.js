var motorVehiclesControllers = angular.module('motorVehiclesControllers', []);

motorVehiclesControllers.controller('mainCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
        $scope.datasets = ['data/Data_Infographic_Image1-2.csv', 'data/Data_Infographic_Image3-4.csv'];
        $scope.strategies = ['Alcohol Interlocks', 'Bicycle Helmet', 'In Person Renewal', 'Increased Seat Belt Fine', 'License Plate Impound', 'Limits on Diversion', 'Motorcycle Helmet', 'Primary Enforcement Seat Belt Law', 'Red Light Camera', 'Saturation Patrols', 'Seat Belt Enforcement Campaign', 'Sobriety Checkpoints', 'Speed Camera', 'Vehicle Impoundment'];
        $scope.strategiesFull = {'Alcohol Interlocks': 'Alcohol Interlocks', 'Bicycle Helmet': 'Bicycle Helmet Laws for Children', 'Bicycle Helmets': 'Bicycle Helmet Laws for Children', 'In Person Renewal': 'In-Person License Renewal', 'In-Person License Renewal': 'In-Person License Renewal', 'Increased Seat Belt Fine': 'Increased Seat Belt Fines', 'Higher Seat Belt Fines': 'Increased Seat Belt Fines', 'License Plate Impound': 'License Plate Impoundment', 'License Plate Impoundment': 'License Plate Impoundment', 'Limits on Diversion': 'Limits on Diversion and Plea Agreements', 'Motorcycle Helmet': 'Universal Motorcycle Helmet Laws', 'Motorcycle Helmets': 'Universal Motorcycle Helmet Laws', 'Primary Enforcement Seat Belt Law': 'Primary Enforcement of Seat Belt Laws', 'Primary Enforcement of Seat Belt Laws': 'Primary Enforcement of Seat Belt Laws', 'Red Light Camera': 'Automated Red-Light Cameras', 'Red-Light Cameras': 'Automated Red-Light Cameras', 'Saturation Patrols': 'Saturation Patrols', 'Seat Belt Enforcement Campaign': 'High-Visibility Enforcement of Seat Belt & Child Restraint Laws', 'Sobriety Checkpoints': 'Sobriety Checkpoints', 'Speed Camera': 'Automated Speed Cameras', 'Speed Cameras': 'Automated Speed Cameras', 'Vehicle Impoundment': 'Vehicle Impoundment'};
        $scope.statecodes = {'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'};
        $scope.embedCode = $window.cdcCommon.runtime.embedCode;
        
        $scope.init = function(){
            $scope.loading = true;
            $scope.error = false;
            $scope.showArrows = false;
            $scope.pageNumber = 1;
            $scope.state = 'Alabama';
            
            if ($window.cdcCommon.getCallParam('defaultState') && $scope.statecodes[$window.cdcCommon.getCallParam('defaultState')]) {
                $scope.state = $window.cdcCommon.getCallParam('defaultState');
            }
            
            $scope.waitingFor = $scope.datasets.length;
            $scope.datasets.forEach(function(url) {
                $http.get(url).then($scope.processData, $scope.handleError);
            });
            
            $('a').bind('click',function(e){
                if(e.target.getAttribute('href') === '#'){
                    e.preventDefault();
                }
            });
            
            $(window).bind('click', function(e){
                if(!$(e.target).hasClass('tooltip') && !$(e.target).hasClass('percentage') && !$(e.target).parent().hasClass('percentage')){
                    $scope.showToolTip = false;
                }
            });
            
            $window.cdcCommon.metrics.trackEvent('Widget Load');
            $window.cdcCommon.metrics.trackEvent('Page 1');
        };

        $scope.processData = function(response) {
            if($scope.error){
                return;
            }
            
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
                        switch (props[j]) {
                            case 'Unimplemented Interventions (Recommended by MV PICCS)':
                            case 'Implemented Interventions':
                            case 'Notation: Strategies Not included':
                                obj[props[j]] = values[j].split(/[0-9]*\./).map(Function.prototype.call, String.prototype.trim);
                                break;
                            default:
                                obj[props[j]] = values[j].trim();
                                break;
                        }
                    }
                }

                if (obj['State']) {
                    if ($scope.data[obj['State']]) {
                        $.extend($scope.data[obj['State']], obj);
                    } else {
                        $scope.data[obj['State']] = obj;
                    }

                }
            }

            $scope.waitingFor--;
            if ($scope.waitingFor === 0) {
                $scope.loading = false;
                
                $scope.setIntervention();
                $scope.drawMap();
            }
        };

        $scope.handleError = function() {
            $scope.loading = false;
            $scope.error = true;
        };

        $scope.findParentPageNumber = function(element) {
            if (element.parentElement) {
                if ($(element.parentElement).hasClass('page')) {
                    return parseInt(element.parentElement.id.replace('page', ''));
                } else {
                    return $scope.findParentPageNumber(element.parentElement);
                }
            } else {
                return undefined;
            }
        };
        
        $scope.changeModal = function(name){
            $scope.modal = name;
            $window.cdcCommon.metrics.trackEvent(name + ' Button');
        };

        $scope.changePage = function(e) {
            if ($(e.target).hasClass('left-arrow') || e.type === 'swiperight') {
                if ($scope.pageNumber > 1) {
                    $scope.pageNumber--;
                }
            } else if ($(e.target).hasClass('right-arrow') || e.type === 'swipeleft') {
                if ($scope.pageNumber < 7) {
                    $scope.pageNumber++;
                }
            }
            $window.cdcCommon.metrics.trackEvent('Page ' + $scope.pageNumber);
            if (e.type === 'swiperight' || e.type === 'swipeleft') {
                $scope.$digest();
            }
        };

        $scope.setIntervention = function() {
            $window.cdcCommon.metrics.trackEvent('State Selected', $scope.state);
            
            $scope.drawMap();
            
            for (var i = 0; i < $scope.strategies.length; i++) {
                if ($scope.data[$scope.state][$scope.strategies[i] + ': Intervention Implemented?'] === 'Yes') {
                    $scope.intervention = $scope.strategies[i];
                    return;
                }
            }
        };

        $scope.drawMap = function() {
            $window.cdcCommon.metrics.trackEvent('Intervention Selected', $scope.intervention );
            
            $scope.mapData = {};
            for (state in $scope.data) {
                if ($scope.data[state][$scope.intervention + ': Intervention Implemented?'] === 'Yes') {
                    $scope.mapData[$scope.statecodes[state]] = {fillKey: 'implemented'};
                }
            }
            
            $('#map').empty();

            $scope.map = new Datamap({
                scope: 'usa',
                element: document.getElementById('map'),
                geographyConfig: {
                    highlightOnHover: false,
                    borderWidth: .3,
                    borderColor: 'black'
                },
                fills: {defaultFill: 'rgb(228, 228, 228)', implemented: 'rgb(133, 193, 243)'},
                data: $scope.mapData
            });
            
            $scope.map.svg.selectAll('path.datamaps-subunit.' + $scope.statecodes[$scope.state]).style('stroke', 'yellow').style('stroke-width', '3');
            
            var desc = document.createElement('desc');
            desc.innerHTML = 'Map of Motor Vehicle Injury Prevention: Benefits and Costs by State';
            $scope.map.svg.node().appendChild(desc);
        };
        
        $scope.trackLink = function(name){
            $window.cdcCommon.metrics.trackEvent('Link Clicked: ' + name);
        };
        
        $scope.init();

    }]);
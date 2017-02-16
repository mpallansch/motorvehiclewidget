var motorVehiclesControllers = angular.module('motorVehiclesControllers', []);

motorVehiclesControllers.controller('mainCtrl', ['$scope', '$http', function($scope, $http){   
    $scope.loading = true;
    $scope.pageNumber = 1;
    $scope.state = 'Alabama';
    $scope.intervention = 'Alcohol Interlocks';
    $scope.strategies = ['Alcohol Interlocks','Bicycle Helment','In Person Renewal', 'Increased Seat Belt Fine', 'License Plate Impound', 'Limits on Diversion', 'Motorcycle Helmet', 'Primary Enforcement Seat Belt Law', 'Red Light Camera', 'Saturation Patrols', 'Seat Belt Enforcement Campaign', 'Sobriety Checkpoints', 'Speed Camera', 'Vehicle Impoundment'];
    
    angular.element(window).bind('resize', function(){
        
    });

    $http.get('test/Data_Infographic_Image1.csv').then(
            function(response) {
                $scope.loading = false;
                
                var lines = response.data.split('\n');
                var props = lines[0].split(',');

                for(var i = 0; i < props.length; i++){
                    if(props[i]){
                        props[i] = props[i].trim();
                    }
                }

                var values, obj;
                $scope.data = {};
                for(var i = 1; i < lines.length; i++){
                    obj = {unimplemented: [], totalInjuries: 0, totalDeaths: 0, totalBenefit: 0, totalCost: 0, totalCostFines: 0};
                    values = lines[i].split(',');

                    for(var j = 0; j < values.length; j++){
                        if(props[j]){
                            obj[props[j]] = values[j];
                        }
                    }

                    for(var j = 0; j < $scope.strategies.length; j++){
                        if(obj[$scope.strategies[j] + ': Intervention Implemented?'] === 'No'){
                            obj.unimplemented.push($scope.strategies[j]);
                            obj.totalInjuries += obj[$scope.strategies[j] + ': # of Injuries Reduced'] ? parseInt(obj[$scope.strategies[j] + ': # of Injuries Reduced']) : 0;
                            obj.totalDeaths += parseInt(obj[$scope.strategies[j] + ': # of Fatalities Reduced']);
                            obj.totalBenefit += parseInt(obj[$scope.strategies[j] + ': Benefit $/year']);
                            obj.totalCost += parseInt(obj[$scope.strategies[j] + ' (Fines Excluded): Cost $/year']);
                            obj.totalCostFines += parseInt(obj[$scope.strategies[j] + ': Cost $/year']);
                        }
                    }

                    if(obj['State']){
                        $scope.data[obj['State'].trim()] = obj;
                    }
                }
                

                $scope.drawMap();
            },
            function(err) {
                console.log(err);
            }
    );

    $scope.changePage = function(e){
        if($(e.target).hasClass('left-arrow') || e.type === 'swiperight'){
            if($scope.pageNumber > 1){
                $scope.pageNumber--;
            }
        } else if($(e.target).hasClass('right-arrow') || e.type === 'swipeleft'){
            if($scope.pageNumber < 4){
                $scope.pageNumber++;
            }
        }
        if(e.type === 'swiperight' || e.type === 'swipeleft'){
            $scope.$digest();
        }
    };

    $scope.drawMap = function(){
        $scope.map = new Datamap({
            scope: 'usa',
            element: document.getElementById('map')
        });
    }

}]);

motorVehiclesControllers.directive('swipePage', [function(){
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            $(element).on('swipeleft', scope.changePage);
            $(element).on('swiperight', scope.changePage);
        }
    };
}]);
var motorVehiclesApp = angular.module('motorVehiclesApp', ['motorVehiclesControllers', 'motorVehiclesDirectives']);

motorVehiclesApp.filter('classify', function(){
    return function(input){
        if(input){
            return input.toLowerCase().replace(/\s/g, '-');
        }
        return '';
    };
});

angular.bootstrap(document.body, ['motorVehiclesApp']);
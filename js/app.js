var motorVehiclesApp = angular.module('motorVehiclesApp', ['motorVehiclesControllers']);

motorVehiclesApp.run(function($rootScope, $http){
        $rootScope.loading = true;
        $http.get('test/test.json').then(
            function(data){
                $rootScope.loading = false;
                $rootScope.data = data.data;
                $rootScope.currentYear = Object.keys($rootScope.data.years)[0];
                $rootScope.currentState = Object.keys($rootScope.data.years[$rootScope.currentYear].states)[0];
                $rootScope.currentStrategy = Object.keys($rootScope.data.years[$rootScope.currentYear].states[$rootScope.currentState].implemented)[0];
            },
            function(err){
                console.log(err);
            }
        );
});

angular.bootstrap(document.body, ['motorVehiclesApp']);
var motorVehiclesDirectives = angular.module('motorVehiclesDirectives', []);

motorVehiclesDirectives.directive('controlNavigation', [function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.bind('focus', function(e) {
                    if ($(e.target).hasClass('arrow')) {
                        scope.showArrows = true;
                    }
                    $('#page-container')[0].scrollLeft = 0;
                    var pagenum = scope.findParentPageNumber(e.target);
                    scope.pageNumber = pagenum || scope.pageNumber;
                    scope.$digest();
                });

            }
        };
    }]);

motorVehiclesDirectives.directive('swipePage', [function() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $(element).on('swipeleft', scope.changePage);
                $(element).on('swiperight', scope.changePage);
            }
        };
    }]);
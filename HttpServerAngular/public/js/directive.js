'use strict';

/* App Module */
var directives = angular.module('directives', []);

// directive center popup
directives.directive('centerScreen', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var window = angular.element($window);

            setPosition();

            window.on('resize', function() {
                setPosition();
            });

            function setPosition() {
                var x = (window.innerHeight() - element.innerHeight())/2,
                    y = (window.innerWidth() - element.innerWidth())/2;

                x = x > 0 ? x : 0;
                y = y > 0 ? y : 0;
                element.css({'top': x, 'left': y});
            }
        }
    }
});

// directive progressbar
directives.directive('progressbar', [function() {
    return {
        restrict: 'A',
        scope: {
            'progress': '=progressbar'
        },
        controller: function($scope, $element, $attrs) {
            $element.progressbar({
                value: $scope.progress
            })

            $scope.$watch(function() {
                $element.progressbar({value: $scope.progress})
            })
        }
    }
}])
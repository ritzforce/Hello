'use strict';
var controllers = angular.module('controllers', []);
/**
 * IBM - WHACK A MOLE GAME Ctrl
 ********************************/
controllers.controller('masterCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {

        // start game
            // point number
            $scope.countItem = 0;
            $scope.count = function(){
                $scope.countItem++
            }

            $scope.value = 0;
            var start;

            // level 1
            $scope.level = 1;
            $scope.seconds = 1000;

            $scope.countUp = function() {
                $scope.begin = true;
                start = $timeout(function() {
                    $scope.value++;   
                    $scope.countUp();
                    if ($scope.countItem == 10 && $scope.countItem < 20) {
                        // level 2
                        $scope.level = 2;
                        $scope.seconds = 800;
                    } else if ($scope.countItem == 20 && $scope.countItem < 50) {
                        // level 3
                        $scope.level = 3;
                        $scope.seconds = 600;
                    } else if ($scope.countItem == 50 && $scope.countItem < 101) {
                        // level 4
                        $scope.level = 4;
                        $scope.seconds = 300;
                    } else if ($scope.value == 101) {
                        $scope.value = 101;
                    };
                }, $scope.seconds);
            };
        // end start game

        // stop game
        $scope.stop = function(){
            $scope.begin = false;
            $timeout.cancel(start);
        }  

        // end game
        $scope.end = function(){
            $scope.begin = false;
            $scope.value = 0;
            $timeout.cancel(start);
            $scope.level = 1;
        }

        // fix height device max 480px
        var $window = $(window),
        $class = $('.container-fluid');

        $window.resize(function resize() {
            if ($window.height() < 481) {
                return $class.addClass('fix-top');
            }

            $class.removeClass('fix-top');
        }).trigger('resize');

    }
]);
angular.module('ionicz.controllers')

.controller('HomeCtrl', function($scope, $log, $timeout, Tools, $ionicSlideBoxDelegate) {
	$log.debug("HomeCtrl...");
	
	$scope.slideList = slideList;
	
	$scope.$on('$ionicView.afterEnter', function() {
		$log.debug("HomeCtrl $ionicView.afterEnter");
	});
});


function changeLanguage() {
            //console.log('???????????????????????');
            var status = $("#language_list").data("status");
            console.log('status: '+status);
            if(status == 0) {
                $("#language_list").show(500);
                $("#language_list").data("status", 1);
            } else {
                $("#language_list").hide(500);
                $("#language_list").data("status", 0);
            } 
        }
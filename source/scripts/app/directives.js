angular.module('Malendar.directives', [])
	.directive('scrollDetect', [function () {
		return {
			'restrict' : 'A',
			'scope' : {
				'scrollHandler' : '&'
			},
			'link' : function (scope, element, attrs) {
				element.bind('wheel', function(e){
					scope.scrollHandler();
					scope.$apply();
				});
			}
		}
	}]);
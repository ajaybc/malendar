angular.module('Malendar.directives', [])
	.directive('scrollDetect', [function () {
		return {
			'restrict' : 'A',
			'scope' : {
				'scrollDownHandler' : '&',
				'scrollUpHandler' : '&'
			},
			'link' : function (scope, element, attrs) {
				window.addEventListener('wheel', function(e){
					if (e.wheelDelta > 0) {
						scope.scrollUpHandler();
					} else {
						scope.scrollDownHandler();
					}
					scope.$apply();
				});
				/*element.bind('wheel', function(e){
					console.log(e);
					console.log(e.deltaMode);
					scope.scrollDownHandler();
					scope.$apply();
				});*/
			}
		}
	}]);
angular.module('Malendar.controllers', [])
	.controller('dateWidgetController', ['$scope', 'monthProvider', 'dayProvider', function($scope, monthProvider, dayProvider) {
		todayMoment = moment();
		todayString = todayMoment.format("D/M/YYYY");
		dayDetails = Malendar.dates[todayString];
		console.log(dayDetails);
		$scope.flipped = false;
		$scope.gregorianMonth = monthProvider.getGregorianMonthName(todayMoment.month());
		$scope.gregorianDate = todayMoment.date();
		$scope.gregorianWeekDay = dayProvider.getGregorianWeekDayName(todayMoment.isoWeekday() - 1);
		$scope.malayalamDate = (dayDetails.MDay < 10)?('0' + dayDetails.MDay):dayDetails.MDay;
		$scope.malayalamMonth = monthProvider.getMalayalamMonthName(dayDetails.MalayalamMonth);
		$scope.malayalamNakshatra = dayDetails.MNakshatra;
		$scope.rahuKalam = dayDetails.Rahu;
		$scope.sunrise = dayDetails.Sunrise;
		$scope.sunset = dayDetails.Sunset;
		$scope.specialities = dayDetails.Speciality;

		$scope.flip = function ($event) {
			if ($scope.flipped) {
				$scope.flipped = false;
			} else {
				$scope.flipped = true;
			}

			if ($event) {
				$event.preventDefault();
			}
		}
	}])
	
	.controller('topBarController', ['$scope', function($scope) {
		$scope.openApplications = function ($event) {
			if (chrome) {
				chrome.tabs.getCurrent(function (currentTab) {
					chrome.tabs.update(currentTab.id, {url: 'chrome://apps/'}, function (tab) {});
				})
			}
			$event.preventDefault();
		}
	}]);
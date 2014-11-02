angular.module('Malendar.controllers', [])
	.controller('dateWidgetController', ['$scope', 'monthProvider', 'dayProvider', 'weatherService', function($scope, monthProvider, dayProvider, weatherService) {
		todayMoment = moment();
		todayString = todayMoment.format("D/M/YYYY");
		dayDetails = Malendar.dates[todayString];
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

		$scope.condition = {};

		$scope.marginTop = calculateMargin($(window).height());

		console.log($scope.marginTop);
		$(window).resize(function () {
			$scope.marginTop = calculateMargin($(window).height());
			$scope.$apply();
		});

		function calculateMargin(screenHeight) {
			calculated = ((screenHeight - 35) / 2) - (600 / 2);
			if (calculated < 35) {
				return '35px';
			} else {
				return calculated + 'px'
			}
		}


		weatherService.getWeatherFromYahoo('kochi')
			.then(function(forecastData) {
				console.log(forecastData);
			    $scope.condition = forecastData.condition;
			    console.log($scope.condition);
			}, function () {
				console.log('No weather');
			});

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
		$scope.openApplication = function (appId, $event) {
			if (chrome.management) {
				//chrome.tabs.getCurrent(function (currentTab) {
					chrome.management.launchApp(appId, function (tab) {});
				//})
			}
			$event.preventDefault();
		}

		$scope.applicationList = [];

		if (chrome.management) {
			chrome.management.getAll(function (extensions) {
				angular.forEach(extensions, function(extension, i) {
					if (extension.isApp) {
						$scope.applicationList.push({
							id : extension.id,
							name : extension.shortName,
							icon : extension.icons[extension.icons.length - 1].url
						});
						$scope.$apply();
					}
				});
			});
		}

		$scope.bookmarkList = [];

		if (chrome.bookmarks) {
			chrome.bookmarks.getTree(function (allBookmarks) {
				if (allBookmarks) {
					bookmarksBar = allBookmarks[0].children[0].children
					angular.forEach(bookmarksBar, function(bookmark, i) {
						if (!bookmark.children) {
							$scope.bookmarkList.push({
								id : bookmark.id,
								title : bookmark.title,
								url : bookmark.url
							});
							$scope.$apply();
						}
					});
				}
			});
		}
	}])


	.controller('weatherController', ['$scope', 'weatherService', 'districtProvider', function($scope, weatherService, districtProvider) {
		$scope.forecasts = [];
		weatherService.getWeatherFromYahoo('kochi')
			.then(function(forecastData) {
			    angular.forEach(forecastData.forecast, function(forecast, index) {
			    	if (index > 0 && index < 4) {
						$scope.forecasts.push(forecast);
			    	}
				});
			}, function () {
				console.log('No weather');
			});
	}])


	.controller('newsController', ['$scope', '$interval', 'newsService', function($scope, $interval, newsService) {
		$scope.newsArray = [];

		$scope.hoverDescription = '';
		$scope.ticker = {};
		$scope.ticker.paused = false;
		$scope.ticker.marginTop = 0;
		$scope.showDescription = function (description) {
			$scope.hoverDescription = description;
		}

		$scope.hideDescription = function () {
			$scope.hoverDescription = '';
		}

		$scope.ticker.start = function () {
			$scope.ticker.timer = $interval(function() {
				if ($scope.ticker.paused == false) {
					$scope.ticker.next();
				}
			}, 3000);
		}

		$scope.ticker.next = function () {
			if (($('.news-ul-wrapper ul').height() + ($scope.ticker.marginTop - 30)) > 30) {
				$scope.ticker.marginTop -= 30;
			} else {
				$scope.ticker.marginTop = 0;
			}
		}

		newsService.getNews('mathrubhumi')
			.then(function(newsData) {
			    angular.forEach(newsData.news, function(news, index) {
			    	$scope.newsArray.push(news);
				});
				$scope.ticker.start();
			}, function () {
				console.log('No news');
			});
	}]);
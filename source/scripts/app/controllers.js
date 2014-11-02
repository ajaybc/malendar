angular.module('Malendar.controllers', [])
	.controller('dateWidgetController', ['$scope', 'monthProvider', 'dayProvider', 'weatherService', 'settingsProvider', function($scope, monthProvider, dayProvider, weatherService, settingsProvider) {
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


		weatherService.getWeatherFromYahoo(settingsProvider.getDistrictId())
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


	.controller('weatherController', ['$scope', 'weatherService', 'districtProvider', 'settingsProvider', function($scope, weatherService, districtProvider, settingsProvider) {
		$scope.forecasts = [];
		weatherService.getWeatherFromYahoo(settingsProvider.getDistrictId())
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

	.controller('settingsController', ['$scope', '$window', '$rootScope', 'districtProvider', 'settingsProvider', function($scope, $window, $rootScope, districtProvider, settingsProvider) {
		$scope.showSettings = false;
		$scope.districts = districtProvider.getDistricts();
		$scope.districtId = settingsProvider.getDistrictId();
		$scope.newsSource = settingsProvider.getNewsSource();
		$scope.newsEnabled = settingsProvider.getNewsEnabled();

		$scope.saveSettings = function ($event) {
			settingsProvider.setDistrictId($scope.districtId);
			settingsProvider.setNewsSource($scope.newsSource);
			settingsProvider.setNewsEnabled($scope.newsEnabled);

			$event.preventDefault();
			$window.location.reload();
		}

		$rootScope.$on('openSettings', function () {
			$scope.showSettings = true;
		});
	}])


	.controller('newsController', ['$scope', '$interval', '$rootScope', '$filter', 'newsService', 'settingsProvider', function($scope, $interval, $rootScope, $filter, newsService, settingsProvider) {
		$scope.newsArray = [];

		$scope.hoverDescription = '';
		$scope.ticker = {};
		$scope.ticker.paused = false;
		$scope.ticker.marginTop = 0;
		$scope.showDescription = function (description) {
			$scope.hoverDescription = $filter('htmlCleaner')(description);
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


		if (settingsProvider.getNewsEnabled() == 'enabled') {
			//Fetch news only if it is enabled
			newsService.getNews(settingsProvider.getNewsSource())
				.then(function(newsData) {
				    angular.forEach(newsData.news, function(news, index) {
				    	$scope.newsArray.push(news);
					});
					$scope.ticker.start();
				}, function () {
					console.log('No news');
				});
		}

		$scope.openSettings = function ($event) {
			$rootScope.$emit('openSettings', {});
			$event.preventDefault();
		}
	}]);
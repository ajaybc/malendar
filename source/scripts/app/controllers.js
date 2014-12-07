angular.module('Malendar.controllers', [])
	.controller('dateWidgetController', ['$scope', 'monthProvider', 'dayProvider', 'weatherService', 'settingsProvider', function($scope, monthProvider, dayProvider, weatherService, settingsProvider) {
		
		$scope.activeMoment = moment();
		renderDateWidget();

		$scope.nextDay = function($event) {
			if ($scope.showNext) {
				$scope.activeMoment = $scope.activeMoment.add({'day' : 1});
			}
			renderDateWidget();
			if ($event) {
				$event.preventDefault();
			}
		}

		$scope.prevDay = function($event) {
			if ($scope.showPrev) {
				$scope.activeMoment = $scope.activeMoment.subtract({'day' : 1});
			}
			renderDateWidget();
			if ($event) {
				$event.preventDefault();
			}
		}

		function renderDateWidget () {
			dayString = $scope.activeMoment.format("D/M/YYYY");
			dayDetails = Malendar.dates[dayString];
			$scope.flipped = false;
			$scope.gregorianMonth = monthProvider.getGregorianMonthName($scope.activeMoment.month());
			$scope.gregorianDate = $scope.activeMoment.date();
			$scope.gregorianWeekDay = dayProvider.getGregorianWeekDayName($scope.activeMoment.isoWeekday() - 1);
			$scope.malayalamDate = (dayDetails.MDay < 10)?('0' + dayDetails.MDay):dayDetails.MDay;
			$scope.malayalamMonth = monthProvider.getMalayalamMonthName(dayDetails.MalayalamMonth);
			$scope.malayalamNakshatra = dayDetails.MNakshatra;
			$scope.rahuKalam = dayDetails.Rahu;
			$scope.sunrise = dayDetails.Sunrise;
			$scope.sunset = dayDetails.Sunset;
			$scope.specialities = dayDetails.Speciality;

			if ($scope.activeMoment.month() == 11 && $scope.activeMoment.date() == 31) {
				//If 31st December. Hide next button. Because we dont have the data right now
				$scope.showNext = false;
			} else {
				$scope.showNext = true;
			}

			if ($scope.activeMoment.month() == 0 && $scope.activeMoment.date() == 1) {
				//If 1st Jan. Hide prev button. Because we dont have the data right now
				$scope.showPrev = false;
			} else {
				$scope.showPrev = true;
			}
		}

		$scope.condition = {};

		$scope.marginTop = calculateMargin($(window).height());
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

		$scope.applications = {};
		$scope.applications.list = [];

		if (chrome.management) {
			chrome.management.getAll(function (extensions) {
				angular.forEach(extensions, function(extension, i) {
					if (extension.isApp) {
						$scope.applications.list.push({
							id : extension.id,
							name : extension.shortName,
							icon : extension.icons[extension.icons.length - 1].url
						});
						$scope.$apply();
					}
				});
			});
		}

		$scope.bookmarks = {};
		$scope.bookmarks.list = [];

		if (chrome.bookmarks) {
			populateBookmarks('1');	//By default open the bookmarks bar folder
			$scope.openBookmarkFolder = function (bookmarkId, $event) {
				populateBookmarks(bookmarkId);
				if ($event) {
					$event.preventDefault();
				}
			}

			function populateBookmarks(id) {
				$scope.bookmarks.list = [];
				$scope.bookmarks.iconList = [];
				chrome.bookmarks.getChildren(id, function (bookmarkTree) {
					angular.forEach(bookmarkTree, function(bookmark, i) {
						if (bookmark.title) {
							$scope.bookmarks.list.push({
								'id' : bookmark.id,
								'title' : bookmark.title,
								'url' : bookmark.url
							});
						} else {
							$scope.bookmarks.iconList.push({
								'id' : bookmark.id,
								'title' : bookmark.title,
								'url' : bookmark.url
							});
						}

					});

					chrome.bookmarks.get(id, function (bookmark) {
						if (bookmark[0].parentId) {
							$scope.bookmarks.backId = bookmark[0].parentId;
						} else {
							$scope.bookmarks.backId = 0;
						}
						$scope.$apply();
					});
				});
			}
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
	}])


	.controller('calendarController', ['$scope', 'monthProvider', function($scope, monthProvider) {
		$scope.days = [];

		today = moment();
		currentMonth = today.month();
		currentYear = today.year();
		lastDayOfMonth = today.endOf('month').date();
		firstMomentOfMonth = today.startOf('month');


		if (firstMomentOfMonth.day() != 0) {
			//Means we need to insert some padding days
			for (i = 0; i < firstMomentOfMonth.day(); i++) {
				$scope.days.push({});
			}
		}

		additionalDays = 0;
		if ((($scope.days.length + lastDayOfMonth ) / 7) > 5) {
			//Means this month will have 5 or more weeks
			additionalDays = ($scope.days.length + lastDayOfMonth ) % 7;
			if (additionalDays) {
				//If there are additional days, then we add them to the start of the calendar month
				for (i=(additionalDays - 1), j=0; i >= 0; i--, j++) {
					dayDetails = getDayDetails(lastDayOfMonth - i, currentMonth + 1, currentYear);
					if (dayDetails.dayOfWeek == 0) {
						//Sunday
						dayDetails.holiday = true;
					} else {
						dayDetails.holiday = false;
					}
					$scope.days[j] = dayDetails;
				}
			}
		}


		saturdayCount = 0;
		for (i = 1; i <= (lastDayOfMonth - additionalDays); i++) {
			dayDetails = getDayDetails(i, currentMonth + 1, currentYear);
			if (dayDetails.dayOfWeek == 0) {
				//Sunday
				dayDetails.holiday = true;
			} else if (dayDetails.dayOfWeek == 6) {
				//Saturday
				saturdayCount++;
				if (saturdayCount == 2) {
					//Second saturday
					dayDetails.holiday = true;
				}
			} else {
				dayDetails.holiday = false;
			}

			$scope.days.push(dayDetails);
		}

		function getDayDetails (day, month, year) {
			dayDetails = Malendar.dates[day + '/' + month + '/' + year];
			return {
				'gregorianDate' : day,
				'malayalamDate' : (dayDetails.MDay < 10)?('0' + dayDetails.MDay):dayDetails.MDay,
				'malayalamMonth' : monthProvider.getMalayalamMonthName(dayDetails.MalayalamMonth),
				'malayalamNakshatra' : dayDetails.MNakshatra,
				'dayOfWeek' : dayDetails.dayOfWeek
			};
		}

		/*generationNext();
		//console.log($scope.days);
		//
		function generationNext () {
			start = moment('2014-1-1', 'YYYY-M-D');
			newData = {};
			newData[start.format('D/M/YYYY')] = Malendar.dates[start.format('D/M/YYYY')];
			newData[start.format('D/M/YYYY')].day = start.day();
			//end = start.endOf('year');
			for (i = 0; i < 364; i++) {
				start.add({'day' : 1});
				newData[start.format('D/M/YYYY')] = Malendar.dates[start.format('D/M/YYYY')];
				newData[start.format('D/M/YYYY')].dayOfWeek = start.day();
			}

			console.log(newData);
			console.log(JSON.stringify(newData));
		}*/
	}]);
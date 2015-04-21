angular.module('Malendar.controllers', [])
    .controller('dateWidgetController', ['$scope', 'monthService', 'dayOfWeekService', 'weatherService', 'settingsService', 'activeMomentService', 'calendarService',
        function($scope, monthService, dayOfWeekService, weatherService, settingsService, activeMomentService, calendarService) {
            $scope.nextDay = function($event) {
                if ($scope.showNext) {
                    activeMomentService.activeMoment = activeMomentService.activeMoment.add({
                        'day': 1
                    });
                }
                if ($event) {
                    $event.preventDefault();
                }
            }

            $scope.prevDay = function($event) {
                if ($scope.showPrev) {
                    activeMomentService.activeMoment = activeMomentService.activeMoment.subtract({
                        'day': 1
                    });
                }
                if ($event) {
                    $event.preventDefault();
                }
            }

            $scope.$watch(function() {
                return activeMomentService.activeMoment
            }, function(newValue, oldValue) {
                if (newValue === oldValue) return;
                renderDateWidget();
            }, true);

            $scope.$watch(function() {
                return settingsService.calendarType
            }, function(newValue) {
                if (settingsService.calendarType == 'dateWidget') {
                    $scope.showDateWidget = true;
                    renderDateWidget();
                } else {
                    $scope.showDateWidget = false;
                }
            });

            function renderDateWidget() {
                dayString = activeMomentService.activeMoment.format("D/M/YYYY");
                dayDetails = Malendar.dates[dayString];
                $scope.flipped = false;
                $scope.gregorianMonth = monthService.getGregorianMonthName(activeMomentService.activeMoment.month());
                $scope.gregorianDate = activeMomentService.activeMoment.date();
                $scope.gregorianWeekDay = dayOfWeekService.getGregorianWeekDayName(activeMomentService.activeMoment.isoWeekday() - 1);
                $scope.malayalamDate = (dayDetails.MDay < 10) ? ('0' + dayDetails.MDay) : dayDetails.MDay;
                $scope.malayalamMonth = monthService.getMalayalamMonthName(dayDetails.MalayalamMonth);
                $scope.malayalamNakshatra = dayDetails.MNakshatra;
                $scope.rahuKalam = dayDetails.Rahu;
                $scope.sunrise = dayDetails.Sunrise;
                $scope.sunset = dayDetails.Sunset;
                $scope.special = dayDetails.special;
                $scope.holiday = dayDetails.holiday;

                if (activeMomentService.activeMoment.month() == 11 && activeMomentService.activeMoment.date() == 31) {
                    //If 31st December. Hide next button. Because we dont have the data right now
                    $scope.showNext = false;
                } else {
                    $scope.showNext = true;
                }

                if (activeMomentService.activeMoment.month() == 0 && activeMomentService.activeMoment.date() == 1) {
                    //If 1st Jan. Hide prev button. Because we dont have the data right now
                    $scope.showPrev = false;
                } else {
                    $scope.showPrev = true;
                }
            }

            $scope.condition = {};

            $scope.marginTop = calculateMargin($(window).height());
            $(window).resize(function() {
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


            weatherService.getWeatherFromYahoo(settingsService.districtId)
                .then(function(forecastData) {
                    $scope.condition = forecastData.condition;
                }, function() {});

            $scope.flip = function($event) {
                if ($scope.flipped) {
                    $scope.flipped = false;
                } else {
                    $scope.flipped = true;
                }

                if ($event) {
                    $event.preventDefault();
                }
            }
        }
    ])

.controller('topBarController', ['$scope', '$timeout', 'settingsService', 
    function($scope, $timeout, settingsService) {
        $scope.openApplication = function(appId, $event) {
            if (chrome.management) {
                chrome.management.launchApp(appId, function(tab) {});
            }
            $event.preventDefault();
        }

        $scope.applications = {};
        $scope.applications.list = [];

        if (chrome.management) {
            chrome.management.getAll(function(extensions) {
                angular.forEach(extensions, function(extension, i) {
                    if (extension.isApp) {
                        $scope.applications.list.push({
                            id: extension.id,
                            name: extension.shortName,
                            icon: extension.icons[extension.icons.length - 1].url
                        });
                        //$scope.$apply();
                    }
                });
            });
        }

        $scope.bookmarks = {};
        $scope.bookmarks.list = [];

        if (chrome.bookmarks) {
            populateBookmarks('1'); //By default open the bookmarks bar folder
            $scope.openBookmarkFolder = function(bookmarkId, $event) {
                populateBookmarks(bookmarkId);
                if ($event) {
                    $event.preventDefault();
                }
            }

            function populateBookmarks(id) {
                $scope.bookmarks.list = [];
                $scope.bookmarks.iconList = [];
                chrome.bookmarks.getChildren(id, function(bookmarkTree) {
                    angular.forEach(bookmarkTree, function(bookmark, i) {
                        if (bookmark.title) {
                            $scope.bookmarks.list.push({
                                'id': bookmark.id,
                                'title': bookmark.title,
                                'url': bookmark.url
                            });
                        } else {
                            $scope.bookmarks.iconList.push({
                                'id': bookmark.id,
                                'title': bookmark.title,
                                'url': bookmark.url
                            });
                        }

                    });
                    chrome.bookmarks.get(id, function(bookmark) {
                        if (bookmark[0].parentId) {
                            $scope.bookmarks.backId = bookmark[0].parentId;
                        } else {
                            $scope.bookmarks.backId = 0;
                        }
                        $timeout(function () {
                            $scope.$apply()
                        });
                    });
                });
            }
        }


        $scope.$watch(function() {
            return settingsService.permissionStatus
        }, function(newValue) {
            $scope.permissionStatus = settingsService.permissionStatus;
        });

        $scope.openCalendar = function() {
            chrome.permissions.request({
                "permissions": ['identity', 'background', 'alarms']
            }, function(granted) {
                // The callback argument will be true if the user granted the permissions.
                if (granted) {
                	chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
						// Use the token.
						chrome.alarms.create('syncAlarm', {
                            'periodInMinutes' : 15
                        })
					});

                    //Inform the newtab page that we have got the alarms permission
                    chrome.runtime.sendMessage({gotPermission: true}, function(response) {
                        console.log(response);
                    });

                    settingsService.setPermissionStatus('permitted');
                }
            });
        }
    }
])


.controller('weatherController', ['$scope', 'weatherService', 'districtService', 'settingsService',
    function($scope, weatherService, districtService, settingsService) {
        $scope.forecasts = [];
        weatherService.getWeatherFromYahoo(settingsService.districtId)
            .then(function(forecastData) {
                angular.forEach(forecastData.forecast, function(forecast, index) {
                    if (index > 0 && index < 4) {
                        $scope.forecasts.push(forecast);
                    }
                });
            }, function() {});

        $scope.$watch(function() {
            return settingsService.calendarType
        }, function(newValue) {
            if (settingsService.calendarType == 'dateWidget') {
                $scope.showWeather = true;
            } else {
                $scope.showWeather = false;
            }
        });
    }
])

.controller('settingsController', ['$scope', '$window', '$rootScope', 'districtService', 'settingsService',
    function($scope, $window, $rootScope, districtService, settingsService) {
        $scope.showSettings = false;
        $scope.districts = districtService.getDistricts();
        $scope.districtId = settingsService.districtId;
        $scope.newsSource = settingsService.newsSource;
        $scope.newsEnabled = settingsService.newsEnabled;

        $scope.saveSettings = function($event) {
            settingsService.setDistrictId($scope.districtId);
            settingsService.setNewsSource($scope.newsSource);
            settingsService.setNewsEnabled($scope.newsEnabled);

            $event.preventDefault();
            $window.location.reload();
        }

        $rootScope.$on('openSettings', function() {
            $scope.showSettings = true;
        });
    }
])


.controller('newsController', ['$scope', '$interval', '$rootScope', '$filter', 'newsService', 'settingsService',
    function($scope, $interval, $rootScope, $filter, newsService, settingsService) {
        $scope.newsArray = [];

        $scope.hoverDescription = '';
        $scope.ticker = {};
        $scope.ticker.paused = false;
        $scope.ticker.marginTop = 0;
        $scope.showDescription = function(description) {
            $scope.hoverDescription = $filter('htmlCleaner')(description);
        }

        $scope.hideDescription = function() {
            $scope.hoverDescription = '';
        }

        $scope.ticker.start = function() {
            $scope.ticker.timer = $interval(function() {
                if ($scope.ticker.paused == false) {
                    $scope.ticker.next();
                }
            }, 3000);
        }

        $scope.ticker.next = function() {
            if (($('.news-ul-wrapper ul').height() + ($scope.ticker.marginTop - 30)) > 30) {
                $scope.ticker.marginTop -= 30;
            } else {
                $scope.ticker.marginTop = 0;
            }
        }

        $scope.ticker.prev = function() {
            if ($scope.ticker.marginTop != 0) {
                $scope.ticker.marginTop += 30;
            } else {
                $scope.ticker.marginTop = (parseInt($('.news-ul-wrapper ul').height()) - 30) * (-1);
            }
        }


        if (settingsService.newsEnabled == 'enabled') {
            //Fetch news only if it is enabled
            newsService.getNews(settingsService.newsSource)
                .then(function(newsData) {
                    angular.forEach(newsData.news, function(news, index) {
                        $scope.newsArray.push(news);
                    });
                    $scope.ticker.start();
                }, function() {});
        }

        $scope.openSettings = function($event) {
            $rootScope.$emit('openSettings', {});
            $event.preventDefault();
        }
    }
])


.controller('calendarController', ['$scope', 'monthService', 'settingsService',
    function($scope, monthService, settingsService) {
        $scope.activeMoment = moment();

        $scope.$watch(function() {
            return settingsService.calendarType
        }, function(newValue) {
            if (settingsService.calendarType == 'calendar') {
                $scope.showCalendar = true;
                renderCalendar();
            } else {
                $scope.showCalendar = false;
            }
        });

        $scope.nextMonth = function($event) {
            $scope.activeMoment = $scope.activeMoment.add({
                'month': 1
            });
            renderCalendar();
            if ($event) {
                $event.preventDefault();
            }
        }

        $scope.prevMonth = function($event) {
            $scope.activeMoment = $scope.activeMoment.subtract({
                'month': 1
            });
            renderCalendar();
            if ($event) {
                $event.preventDefault();
            }
        }

        function renderCalendar() {
            $scope.days = monthService.getMonth($scope.activeMoment.year(), $scope.activeMoment.month() + 1);
        	console.log($scope.days);
            malayalamMonths = monthService.getMalayalamMonthFromGregorianMonth($scope.activeMoment.year(), $scope.activeMoment.month() + 1);
            $scope.gregorianMonth = monthService.getGregorianMonthName($scope.activeMoment.month());
            $scope.malayalamMonths = malayalamMonths[0] + ' - ' + malayalamMonths[1];
            if ($scope.activeMoment.month() == 11) {
                //If December. Hide next button. Because we dont have the data right now
                $scope.showNext = false;
            } else {
                $scope.showNext = true;
            }

            if ($scope.activeMoment.month() == 0) {
                //If Jan. Hide prev button. Because we dont have the data right now
                $scope.showPrev = false;
            } else {
                $scope.showPrev = true;
            }
            console.log(Math.round(performance.memory.usedJSHeapSize / 10000, 2) / 100 + ' MB');
        }
    }
])


.controller('calendarSwitchController', ['$scope', 'settingsService',
    function($scope, settingsService) {
        $scope.calendarType = settingsService.calendarType;
        $scope.setCalendarType = function(calendarType) {
            $scope.calendarType = calendarType;
            settingsService.setCalendarType(calendarType);
        }
    }
])


.controller('eventTickerController', ['$scope', 'activeMomentService', 'calendarService', 'settingsService', 
    function($scope, activeMomentService, calendarService, settingsService) {
        $scope.$watch(function() {
            return settingsService.calendarType
        }, function(newValue) {
            $scope.calendarType = settingsService.calendarType;
        });

        $scope.$watch(function() {
            return activeMomentService.activeMoment
        }, function(newValue, oldValue) {
            $scope.index = 0;
            $scope.eventsToday = calendarService.getEventsForDay(activeMomentService.activeMoment);
            console.log($scope.eventsToday);
        }, true);
    }
]);
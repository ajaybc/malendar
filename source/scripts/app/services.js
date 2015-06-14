angular.module('Malendar.services', [])
    .service('settingsService', function() {
        this.districtId = (window.localStorage.getItem('config_districtId')) ? window.localStorage.getItem('config_districtId') : 'kochi';
        this.newsSource = (window.localStorage.getItem('config_newsSource')) ? window.localStorage.getItem('config_newsSource') : 'manorama';
        this.newsEnabled = (window.localStorage.getItem('config_newsEnabled')) ? window.localStorage.getItem('config_newsEnabled') : 'enabled';
        this.calendarType = (window.localStorage.getItem('config_calendarType')) ? window.localStorage.getItem('config_calendarType') : 'dateWidget';
    
        this.setNewsSource = function(newsSource) {
            window.localStorage.setItem('config_newsSource', newsSource);
            this.newsSource = newsSource;
        }
        this.setDistrictId = function(districtId) {
            window.localStorage.setItem('config_districtId', districtId);
            this.districtId = districtId;
        }
        this.setNewsEnabled = function(newsEnabled) {
            window.localStorage.setItem('config_newsEnabled', newsEnabled);
            this.newsEnabled = newsEnabled;
        }
        this.setCalendarType = function(calendarType) {
            window.localStorage.setItem('config_calendarType', calendarType);
            this.calendarType = calendarType;
        }
    })

    .service('monthService', function() {
        this.getGregorianMonthName = function(monthIndex) {
            var monthNames = [
                'ജനുവരി',
                'ഫെബ്രുവരി',
                'മാർച്ച്‌',
                'ഏപ്രിൽ',
                'മെയ്‌',
                'ജൂണ്‍',
                'ജൂലൈ',
                'ഓഗസ്റ്റ്‌',
                'സെപ്റ്റംബർ',
                'ഒക്ടോബർ',
                'നവംബർ',
                'ഡിസംബർ'
            ]
            return monthNames[monthIndex];
        }

        this.getMalayalamMonthName = function(monthIndex) {
            var monthNames = [
                'ചിങ്ങം',
                'കന്നി ',
                'തുലാം',
                'വൃശ്ചികം',
                'ധനു',
                'മകരം',
                'കുംഭം',
                'മീനം',
                'മേടം',
                'ഇടവം',
                'മിഥുനം',
                'കര്‍ക്കടകം'
            ]
            return monthNames[monthIndex - 1];
        }
        this.getMonth = function(year, month) {
            var firstMomentOfMonth = moment(year + '-' + month + '-' + '1', 'YYYY-M-D');
            var lastMomentOfMonth = moment(year + '-' + month + '-' + '1', 'YYYY-M-D').endOf('month');
            lastDayOfMonth = lastMomentOfMonth.date();
            var today = moment();

            var days = [];

            if (firstMomentOfMonth.day() != 0) {
                //Means we need to insert some padding days
                for (i = 0; i < firstMomentOfMonth.day(); i++) {
                    days.push({});
                }
            }

            var additionalDays = 0;
            if (((days.length + lastDayOfMonth) / 7) > 5) {
                //Means this month will have 5 or more weeks
                additionalDays = (days.length + lastDayOfMonth) % 7;
                if (additionalDays) {
                    //If there are additional days, then we add them to the start of the calendar month
                    for (i = (additionalDays - 1), j = 0; i >= 0; i--, j++) {
                        dayDetails = this.getDayDetails(lastDayOfMonth - i, month, year);
                        days[j] = dayDetails;
                    }
                }
            }

            saturdayCount = 0;
            for (i = 1; i <= (lastDayOfMonth - additionalDays); i++) {
                dayDetails = this.getDayDetails(i, month, year);
                if (i == today.date() && month == (today.month() + 1)) {
                    dayDetails.today = true;
                }
                days.push(dayDetails);
            }

            return days;
        }

        this.getDayDetails = function(day, month, year) {
            var dayDetails = Malendar.dates[day + '/' + month + '/' + year];
            return {
                'gregorianDate': day,
                'malayalamDate': (dayDetails.MDay < 10) ? ('0' + dayDetails.MDay) : dayDetails.MDay,
                'malayalamMonth': this.getMalayalamMonthName(dayDetails.MalayalamMonth),
                'malayalamNakshatra': dayDetails.MNakshatra,
                'dayOfWeek': dayDetails.dayOfWeek,
                'holiday': dayDetails.holiday,
                'special': dayDetails.special
            };
        }

        this.getMalayalamMonthFromGregorianMonth = function(year, month) {
            var firstMomentOfMonth = moment(year + '-' + month + '-' + '1', 'YYYY-M-D');
            var lastMomentOfMonth = moment(year + '-' + month + '-' + '1', 'YYYY-M-D').endOf('month');
            return [
                this.getDayDetails(firstMomentOfMonth.date(), firstMomentOfMonth.month() + 1, firstMomentOfMonth.year()).malayalamMonth,
                this.getDayDetails(lastMomentOfMonth.date(), lastMomentOfMonth.month() + 1, firstMomentOfMonth.year()).malayalamMonth
            ]
        }
    })

    .service('dayOfWeekService', function() {
        this.getGregorianWeekDayName = function(dayIndex) {
            dayNames = [
                'തിങ്കൾ',
                'ചൊവ്വ',
                'ബുധൻ',
                'വ്യാഴം',
                'വെള്ളി',
                'ശനി',
                'ഞായർ'
            ]
            return dayNames[dayIndex];
        }
    })

    .service('districtService', function() {
        this.getDistricts = function() {
                districts = {
                    'kochi': {
                        'malayalamName': 'കൊച്ചി',
                        'yahooWoeid': 2295423
                    },
                    'kasaragod': {
                        'malayalamName': 'കാസർകോട്',
                        'yahooWoeid': 2293962
                    },
                    'kannur': {
                        'malayalamName': 'കണ്ണൂർ',
                        'yahooWoeid': 2295301
                    },
                    'wayanad': {
                        'malayalamName': 'വയനാട്',
                        'yahooWoeid': 12586465
                    },
                    'kozhikode': {
                        'malayalamName': 'കോഴിക്കോട്',
                        'yahooWoeid': 2295316
                    },
                    'malappuram': {
                        'malayalamName': 'മലപ്പുറം ',
                        'yahooWoeid': 2294475
                    },
                    'palakkad': {
                        'malayalamName': 'പാലക്കാട്‌ ',
                        'yahooWoeid': 2295329
                    },
                    'thrissur': {
                        'malayalamName': 'തൃശൂർ ',
                        'yahooWoeid': 2295334
                    },
                    'idukki': {
                        'malayalamName': 'ഇടുക്കി ',
                        'yahooWoeid': 2294557
                    },
                    'kottayam': {
                        'malayalamName': 'കോട്ടയം ',
                        'yahooWoeid': 2295351
                    },
                    'alappuzha': {
                        'malayalamName': 'ആലപ്പുഴ ',
                        'yahooWoeid': 2294673
                    },
                    'pathanamthitta': {
                        'malayalamName': 'പത്തനംതിട്ട ',
                        'yahooWoeid': 2294690
                    },
                    'kollam': {
                        'malayalamName': 'കൊല്ലം ',
                        'yahooWoeid': 2295368
                    },
                    'thiruvananthapuram': {
                        'malayalamName': 'തിരുവനന്തപുരം ',
                        'yahooWoeid': 2295426
                    }
                }
                return districts;
        }
    })

    .service('weatherService', ['$http', '$q', 'districtService',
        function($http, $q, districtService) {
            this.getWeatherFromYahoo = function(districtName) {
                return $q(function(resolve, reject) {
                    var now = moment();
                    var noCache = false;
                    cachedWeatherJson = window.localStorage.getItem('weather_' + districtName);
                    if (cachedWeatherJson) {
                        cachedWeather = JSON.parse(cachedWeatherJson);
                        cachedMoment = moment(cachedWeather.cacheTime);
                        if (now.date() == cachedMoment.date()) {
                            //If this cache is from the same date
                            if (now.diff(cachedMoment, 'seconds') < 3600) {
                                //If this cache is not older than 1 hour
                                //We can accept it
                                resolve({
                                    'forecast': cachedWeather.forecast,
                                    'condition': cachedWeather.condition
                                });
                            } else {
                                noCache = true;
                            }
                        } else {
                            noCache = true;
                        }
                    } else {
                        noCache = true;
                    }

                    if (noCache) {
                        console.log('not from cache');
                        yahooWoeid = districtService.getDistricts()[districtName]['yahooWoeid'];
                        var request = $http.get(
                            'http://api-malendar.rhcloud.com/weather.php', {
                                params: {
                                    'yahooWoeid': yahooWoeid
                                }
                            }
                        ).success(function(data, status, headers, config) {
                            window.localStorage.setItem('weather_' + districtName, JSON.stringify({
                                'cacheTime': now.format('YYYY-MM-DD HH:mm:ss'),
                                'forecast': data.forecast,
                                'condition': data.condition
                            }));
                            resolve({
                                'forecast': data.forecast,
                                'condition': data.condition
                            });
                        });
                    }
                });
            }
        }
    ])


    .service('newsService', ['$http', '$q',
        function($http, $q) {
            this.getNews = function(source) {
                return $q(function(resolve, reject) {
                    var now = moment();
                    var noCache = false;
                    cachedNewsJson = window.localStorage.getItem('news_' + source);
                    if (cachedNewsJson) {
                        cachedNews = JSON.parse(cachedNewsJson);
                        cachedMoment = moment(cachedNews.cacheTime);
                        if (now.date() == cachedMoment.date()) {
                            //If this cache is from the same date
                            if (now.diff(cachedMoment, 'seconds') < 3600) {
                                //If this cache is not older than 1 hour
                                //We can accept it
                                resolve({
                                    'news': cachedNews.news
                                });
                            } else {
                                noCache = true;
                            }
                        } else {
                            noCache = true;
                        }
                    } else {
                        noCache = true;
                    }

                    if (noCache) {
                        var request = $http.get(
                            'http://api-malendar.rhcloud.com/news.php', {
                                params: {
                                    'source': source
                                }
                            }
                        ).success(function(data, status, headers, config) {
                            window.localStorage.setItem('news_' + source, JSON.stringify({
                                'cacheTime': now.format('YYYY-MM-DD HH:mm:ss'),
                                'news': data.news,
                            }));
                            resolve({
                                'news': data.news
                            });
                        });
                    }
                });
            }
        }
    ])


    .service('activeMomentService', [function () {
        this.activeMoment = moment();
    }])

    .service('calendarService', [function () {
        this.getEventsForDay = function (m) {
            //Get all events for a day. Accepts a moment
            var month = m.month() + 1;
            var day = m.date();
            var calendarJson = window.localStorage.getItem('calendar_' + month);
            if (calendarJson) {
                var calendarData = JSON.parse(calendarJson);
                if (calendarData[day]) {
                    for (var i=0; i < calendarData[day].length; i++) {
                        if (calendarData[day][i].start) {
                            if (calendarData[day][i].start.dateTime) {
                                calendarData[day][i].startMoment = moment(calendarData[day][i].start.dateTime);
                            } else if (calendarData[day][i].start.date) {
                                calendarData[day][i].startMoment = moment(calendarData[day][i].start.date);
                            }
                        }

                        if (calendarData[day][i].end) {
                            if (calendarData[day][i].end.dateTime) {
                                calendarData[day][i].endMoment = moment(calendarData[day][i].end.dateTime);
                            } else if (calendarData[day][i].end.date) {
                                calendarData[day][i].endMoment = moment(calendarData[day][i].end.date);
                            }
                        }
                    }
                    return calendarData[day];
                } else {
                    return [];
                }

            } else {
                return [];
            }
        }

        this.getUpcomingEventsForTheDay = function (m) {
            //Get all upcoming events for a day. Returns only those events with same date but > time
            var events = this.getEventsForDay(m);
            var filteredEvents = [];
            for (var i=0; i < events.length; i++) {
                if (m.isBefore(events[i].endMoment)) {
                    //If current time < end of the event, push to array
                    filteredEvents.push(events[i]);
                }
            }

            return filteredEvents;
        }
    }]);
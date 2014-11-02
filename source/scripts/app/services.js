angular.module('Malendar.services', [])
	.factory('monthProvider', function () {
		return {
			getGregorianMonthName : function (monthIndex) {
				monthNames = [
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
			},

			getMalayalamMonthName : function (monthIndex) {
				monthNames = [
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
		}
	})

	.factory('dayProvider', function () {
		return {
			getGregorianWeekDayName : function (dayIndex) {
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
		}
	})

	.factory('districtProvider', function () {
		return {
			getDistricts : function () {
				districts = {
					'kochi' : {
						'malayalamName' : 'കൊച്ചി',
						'yahooWoeid' : 2295423
					},
					'kasaragod' : {
						'malayalamName' : 'കാസർകോട്',
						'yahooWoeid' : 2293962
					},
					'kannur' : {
						'malayalamName' : 'കണ്ണൂർ',
						'yahooWoeid' : 2295301
					},
					'wayanad' : {
						'malayalamName' : 'വയനാട്',
						'yahooWoeid' : 12586465
					},
					'kozhikode' : {
						'malayalamName' : 'കോഴിക്കോട്',
						'yahooWoeid' : 2295316
					},
					'malappuram' : {
						'malayalamName' : 'മലപ്പുറം ',
						'yahooWoeid' : 2294475
					},
					'palakkad' : {
						'malayalamName' : 'പാലക്കാട്‌ ',
						'yahooWoeid' : 2295329
					},
					'thrissur' : {
						'malayalamName' : 'തൃശൂർ ',
						'yahooWoeid' : 2295334
					},
					'idukki' : {
						'malayalamName' : 'ഇടുക്കി ',
						'yahooWoeid' : 2294557
					},
					'kottayam' : {
						'malayalamName' : 'കോട്ടയം ',
						'yahooWoeid' : 2295351
					},
					'alappuzha' : {
						'malayalamName' : 'ആലപ്പുഴ ',
						'yahooWoeid' : 2294673
					},
					'pathanamthitta' : {
						'malayalamName' : 'പത്തനംതിട്ട ',
						'yahooWoeid' : 2294690
					},
					'kollam' : {
						'malayalamName' : 'കൊല്ലം ',
						'yahooWoeid' : 2295368
					},
					'thiruvananthapuram' : {
						'malayalamName' : 'തിരുവനന്തപുരം ',
						'yahooWoeid' : 2295426
					}
				}
				return districts;
			}
		}
	})

	.service('weatherService', ['$http', '$q', 'districtProvider',function ($http, $q, districtProvider) {
		return {
			getWeatherFromYahoo : function (districtName) {
				return $q(function(resolve, reject) {
					now = moment();
					noCache = false;
					cachedWeatherJson = window.localStorage.getItem('weather_' + districtName);
					if (cachedWeatherJson) {
						cachedWeather = JSON.parse(cachedWeatherJson);
						cachedMoment = moment(cachedWeather.cacheTime);
						if (now.date() == cachedMoment.date()) {
							//If this cache is from the same date
							if (now.diff(cachedMoment, 'seconds') < 3600) {
								//If this cache is not older than 1 hour
								//We can accept it
								resolve({'forecast' : cachedWeather.forecast, 'condition' : cachedWeather.condition});
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
						yahooWoeid = districtProvider.getDistricts()[districtName]['yahooWoeid'];
						var request = $http.get(
							'https://query.yahooapis.com/v1/public/yql',
							{
								params : {
				                    'q' : "select * from xml where url='http://weather.yahooapis.com/forecastrss?w=" + yahooWoeid + "&u=c'",
				                    'format' : 'json'
			                	}
			                }
		                ).success(function(data, status, headers, config) {
		                	window.localStorage.setItem('weather_' + districtName, JSON.stringify({
		                		'cacheTime' : now.format('YYYY-MM-DD HH:mm:ss'),
		                		'forecast' : data.query.results.rss.channel.item.forecast,
		                		'condition' : data.query.results.rss.channel.item.condition
		                	}));
						    resolve({'forecast' : data.query.results.rss.channel.item.forecast, 'condition' : data.query.results.rss.channel.item.condition});
						});
					}
				});
			}
		}
	}])


	.service('newsService', ['$http', '$q', function ($http, $q) {
		return {
			getNews : function (source) {
				return $q(function(resolve, reject) {
					now = moment();
					noCache = false;
					cachedNewsJson = window.localStorage.getItem('news_' + source);
					if (cachedNewsJson) {
						cachedNews = JSON.parse(cachedNewsJson);
						cachedMoment = moment(cachedNews.cacheTime);
						if (now.date() == cachedMoment.date()) {
							//If this cache is from the same date
							if (now.diff(cachedMoment, 'seconds') < 3600) {
								//If this cache is not older than 1 hour
								//We can accept it
								resolve({'news' : cachedNews.news});
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
						console.log(source == 'manorama');
						if (source == 'manorama') {
							sourceUrl = 'http://www.manoramaonline.com/rss/news/';
						} else {
							sourceUrl = 'http://feeds.feedburner.com/mathrubhumi';
						}
						var request = $http.get(
							'https://query.yahooapis.com/v1/public/yql',
							{
								params : {
				                    'q' : 'select title, description, link from xml where url="' + sourceUrl + '" and itemPath="/rss/channel/item" LIMIT 10',
				                    'format' : 'json'
			                	}
			                }
		                ).success(function(data, status, headers, config) {
		                	window.localStorage.setItem('news_' + source, JSON.stringify({
		                		'cacheTime' : now.format('YYYY-MM-DD HH:mm:ss'),
		                		'news' : data.query.results.item,
		                	}));
						    resolve({'news' : data.query.results.item});
						});
					}
				});
			}
		}
	}]);
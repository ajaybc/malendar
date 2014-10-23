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
				return monthNames[monthIndex];
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
			getWeatherForcastFromYahoo : function (districtName) {
				yahooWoeid = districtProvider.getDistricts()[districtName]['yahooWoeid'];
				var request = $http.get(
					'https://query.yahooapis.com/v1/public/yql',
					{
						params : {
		                    'q' : "select * from xml where url='http://weather.yahooapis.com/forecastrss?w=" + yahooWoeid + "&u=c'",
		                    'format' : 'json'
	                	}
	                }
                );
                return request;
			},

			getWeatherIconFromCode : function (code) {
				weatherIcons = [
					"tornado",
					"storm-showers",
					"hurricane",
					"thunderstorm",
					"thunderstorm",
					"snow",
					"mixed rain and sleet",
					"snow",
					"day-sprinkle",
					"day-sprinkle",
					"day-sprinkle",
					"showers",
					"showers",
					"snow",
					"snow",
					"snow-wind",
					"snow",
					"hail",
					"day-sleet-storm",
					"dust",
					"fog",
					"day-fog",
					"smoke",
					"blustery",	// NO IDEA
					"strong-wind",
					"snowflake-cold",
					"cloudy",
					"night-cloudy",
					"day-cloudy",
					"night-partly-cloudy",
					"day-cloudy",
					"night-clear",
					"day-sunny",
					"night-clear",
					"day-sunny",
					"hail",
					"hot",
					"thunderstorm",
					"thunderstorm",
					"thunderstorm",
					"showers",
					"snow",
					"snow",
					"snow",
					"cloudy",
					"storm-showers",
					"snow-thunderstorm",
					"storm-showers"
				]
				return weatherIcons[code];
			}
		}
	}]);
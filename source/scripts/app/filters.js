angular.module('Malendar.filters', [])
	.filter('weatherIcon', function() {
		return function (weatherCode) {
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
			];

			return 'wi wi-' + weatherIcons[weatherCode];
		}
	});
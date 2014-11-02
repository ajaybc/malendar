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
	})

	.filter('htmlCleaner', function() {
		//Thanks to http://stackoverflow.com/questions/17164335/how-to-remove-only-html-tags-in-a-string-using-javascript
		return function (txt) {
			return txt.replace(/<\/?(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|bgsound|big|blink|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|isindex|kbd|keygen|label|legend|li|link|listing|main|map|mark|marquee|menu|menuitem|meta|meter|nav|nobr|noframes|noscript|object|ol|optgroup|option|output|p|param|plaintext|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|spacer|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr|xmp)\b[^<>]*>/g, "");
		}
	});
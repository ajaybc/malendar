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
	});
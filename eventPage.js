//oauth2 auth
var accessToken;

/*chrome.alarms.onAlarm.addListener(function (alarm) {
	window.localStorage.setItem('lastAlarmTime', new Date().toString());
	startCalendarSync();
});*/


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.gotPermission) {
        	//Got permission for settings alarms
        	console.log('Started listening for alarms');
        	startCalendarSync();
        	chrome.alarms.onAlarm.addListener(function (alarm) {
				window.localStorage.setItem('lastAlarmTime', new Date().toString());
				startCalendarSync();
			});
        }
    }
);


function startCalendarSync() {
    chrome.identity.getAuthToken({
            'interactive': true
        },
        function(token) {
            accessToken = token;
            if (window.gapi) {
                authorize();
                calendarApiLoaded();
            } else {
                //load Google's javascript client libraries, if not loaded
                window.gapi_onload = function() {
                    gapi.client.load('calendar', 'v3', calendarApiLoaded);
                    authorize();
                }
                loadScript('https://apis.google.com/js/client.js');
            }
        }
    );
}

function loadScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function authorize() {
    gapi.auth.setToken({
        'access_token': accessToken
    });
}

function calendarApiLoaded() {
    fetchCalendar('primary');
}

function fetchCalendar(calendarId) {
    var y = 2015;
    var firstDayOfYear = new Date(y, 0, 1);
    var lastDayOfYear = new Date(y, 12, 0);

    var parsedData = {};


    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'singleEvents': true,
        'timeMin': firstDayOfYear.toISOString(),
        'timeMax': lastDayOfYear.toISOString()
    }).execute(processEvents);

    function processEvents(resp) {
        if (!resp.error) {
            for (var i = 0; i < resp.items.length; i++) {
                if (resp.items[i].start.dateTime) {
                    var eventStartDate = new Date(resp.items[i].start.dateTime);
                } else {
                    var eventStartDate = new Date(resp.items[i].start.date);
                }
                var monthIndex = eventStartDate.getMonth() + 1;
                //var eventKey = eventStartDate.getDate();
                if (!parsedData[monthIndex]) {
                    parsedData[monthIndex] = {};
                }

                if (!parsedData[monthIndex][eventStartDate.getDate()]) {
                    parsedData[monthIndex][eventStartDate.getDate()] = [];
                }

                parsedData[monthIndex][eventStartDate.getDate()].push({
                    id: resp.items[i].id,
                    summary: resp.items[i].summary,
                    start: resp.items[i].start,
                    end: resp.items[i].end,
                    status: resp.items[i].status,
                    htmlLink: resp.items[i].htmlLink
                });
            }
            if (resp.nextPageToken) {
                gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'singleEvents': true,
                    'timeMin': firstDayOfYear.toISOString(),
                    'timeMax': lastDayOfYear.toISOString(),
                    'pageToken': resp.nextPageToken
                }).execute(processEvents);
            } else {
                console.log(parsedData);
            }

            for (var i = 1; i <= 12; i++) {
                if (parsedData[i]) {
                    window.localStorage.setItem('calendar_' + i, JSON.stringify(parsedData[i]));
                }
            }
        } else {
            console.log(resp.error);
        }
    }
}
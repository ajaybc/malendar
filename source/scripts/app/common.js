var Malendar = {}
Malendar.app = angular.module('Malendar', ['Malendar.controllers', 'Malendar.services', 'Malendar.filters', 'Malendar.directives'])
	.config( [
	    '$compileProvider',
	    function( $compileProvider )
	    {
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome):|data:image\//);
	        $compileProvider.debugInfoEnabled(false);
	    }
	]);

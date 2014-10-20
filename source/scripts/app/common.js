var Malendar = {}
Malendar.app = angular.module('Malendar', ['Malendar.controllers', 'Malendar.services'])
				.config( [
				    '$compileProvider',
				    function( $compileProvider )
				    {   
				        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
				        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome):|data:image\//);
				        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
				    }
				]);
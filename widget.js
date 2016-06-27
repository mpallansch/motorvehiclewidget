(function(window, document, undefined) {

	window.CDC = window.CDC || {};
	window.CDC.Widget = window.CDC.Widget || {};
	window.CDC.Widget.load = function () {

		// ADD POINTER/SHORTCUT FOR COMMON
		window.cdcCommon = window.CDC.Widget.Common;

		// ADD POINTER/SHORTCUT FOR METRICS
		window.cdcMetrics = window.cdcCommon.metrics;

		var objMetricsParams = {
			c32 : 'widget-117',
			useMetrics : false
		};

		// INIT METRICS
		cdcMetrics.init(objMetricsParams);

		// SETUP EMBED CODE (widgetName, [array of params to include in embed generation])
		cdcCommon.createEmbedCode(cdcCommon.getCallParam('wn'),['data-news-feed','data-news-feed-type','data-photos-feed','data-photos-feed-type','data-widget-min-width','data-widget-max-width', 'data-widget-max-height','data-style-path']);

		// LOAD CONTROLLERS
		cdcCommon.loadScript('./js/controllers.js', function(){
			cdcCommon.loadScript('./js/app.js', function(){
				// CALLBACK AFTER APP LOAD (IF NEEDED)
			});
		});
	};

} (window, document));
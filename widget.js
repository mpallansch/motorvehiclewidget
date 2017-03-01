(function(window, document) {

    window.CDC = window.CDC || {};
    window.CDC.Widget = window.CDC.Widget || {};
    window.CDC.Widget.load = function() {

        window.cdcCommon = window.CDC.Widget.Common;

        window.cdcMetrics = window.cdcCommon.metrics;

        var objMetricsParams = {
            c32: 'widget-200',
            useMetrics: 'true'
        };

        cdcMetrics.init(objMetricsParams);

        cdcCommon.createEmbedCode(cdcCommon.getCallParam('wn'), ['data-default-state']);

        cdcCommon.loadScript('./js/controllers.js', function() {
            cdcCommon.loadScript('./js/directives.js', function() {
                cdcCommon.loadScript('./js/app.js');
            });
        });
    };

}(window, document));
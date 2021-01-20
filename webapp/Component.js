sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SS/SigniwisSports/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("SS.SigniwisSports.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			// var url = '/sap/opu/odata/sap/ZDEMO_DATA_SRV/';
			// var oModel = new sap.ui.model.odata.ODataModel(url, true);
			// sap.ui.getCore().setModel(oModel);

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});
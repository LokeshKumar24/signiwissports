sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter"
], function (Controller, FilterOperator, Filter) {
	"use strict";

	return Controller.extend("SS.SigniwisSports.controller.ProductionLogin", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf SS.SigniwisSports.view.ProductionLogin
		 */
		onInit: function () {
		// debugger;
		// this.tableLength();
		},
			// 	onAfterRendering: function() {
		
			// },
			tableLength:function(){
		 if(this.getOwnerComponent().getModel("ticketing")){
			var ticketArray=this.getOwnerComponent().getModel("ticketing").getProperty("/raiseTicket");
			this.getView().byId("idTable").setVisibleRowCount(ticketArray.length);
			}
				
			},

		oDataModified: [],

		onBtnPress1: function (oEvent) {
			var btn = oEvent.getSource().oParent.mAggregations.cells;
			btn[5].getProperty("text");
			btn[5].setProperty("text", "Approved");
			btn[4].setEnabled(false);
			btn[3].setEnabled(false);

		},

		onBtnPress2: function (oEvent) {

			var btn = oEvent.getSource().oParent.mAggregations.cells;
			btn[5].getProperty("text");
			btn[5].setProperty("text", "Declined");
			btn[4].setEnabled(false);
			btn[3].setEnabled(false);

		},
		onLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteApp");
			 if(this.getOwnerComponent().getModel("ticketing")){
			
						this.oDataModified = this.getOwnerComponent().getModel("ticketing").getProperty("/raiseTicket");
			for (var i = 0; i < this.oDataModified.length; i++) {
				if(this.oDataModified[i].pStatus !== "InProcess"){
				this.oDataModified[i].status = "Completed";
				}
			}
			var ticketData = {
				raiseTicket: this.oDataModified
			};
			var model = new sap.ui.model.json.JSONModel(ticketData);
			this.getOwnerComponent().setModel(model, "ticketing");
			 }
		},
		oPopUp: null,
		onShowTicket: function () {
			if (!this.oPopUp) {
				var oid = this.createId("productFragId");
				this.oPopUp = new sap.ui.xmlfragment(oid, "SS.SigniwisSports.view.productInfo", this);
				this.oPopUp.bindAggregation("items", {
					path: "/productionList",
					template: new sap.m.ObjectListItem({
						intro: "{productName}",
					icon: "{image}",
					title: "{brand}",
					type: "Active",
					 attributes:[
                       new sap.m.ObjectAttribute(
                       	{text:"{productId}"}
                       	)
                      ]
					})
				});
				this.getView().addDependent(this.oPopUp);
			}
			this.oPopUp.open();

		},
		onClose: function () {
			this.oPopUp.removeAllItems();
		},
		handleSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new Filter("productName", FilterOperator.Contains, sValue);
				var oFilter2 = new Filter("brand", FilterOperator.Contains, sValue);
				var oBinding = oEvent.getSource().getBinding("items");
				var oFilter = [oFilter1, oFilter2];
				oBinding.filter([oFilter]);
			},
				onExit: function() {

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf SS.SigniwisSports.view.ProductionLogin
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf SS.SigniwisSports.view.ProductionLogin
		 */
	
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf SS.SigniwisSports.view.ProductionLogin
		 */
		

	});

});
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/Token"
], function (Controller, UIComponent, MessageToast, Fragment, Filter, FilterOperator, JSONModel,Token) {
	"use strict";

	return Controller.extend("SS.SigniwisSports.controller.SalesLogin", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf SS.SigniwisSports.view.SalesLogin
		 */
		today: null,
		onInit: function () {

			var date = new Date();
			var day = date.getDate();
			var month = date.getMonth();
			var year = date.getFullYear();
			this.today = (day + "/" + month + "/" + year);

			 var carousel = this.getView().byId("carousel");
		           carousel.setLoop(true);
		           setTimeout(function() { carousel.next(); }, 2500);
		          this.changeImage();
		           //default product
		           this.onSelect();
		           
		           	//randon id 
			var orderVal = Math.floor(Math.random() * 12345);
			this.getView().byId("orderId").setValue(orderVal);
		},

	changeImage:function(){
		 var carousel = this.getView().byId("carousel");
		     
                    // setTimeout(function() { carousel.next(); }, 2500);
                    // this.changeImage();
                  
	},
		onLogout: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.navTo("RouteApp");
		},
		//	Overview Code
		press: function (oEvent) {
			MessageToast.show("The interactive line chart is pressed.");
		},

		selectionChanged: function (oEvent) {
			var oPoint = oEvent.getParameter("point");
			MessageToast.show("The selection changed: " + oPoint.getLabel() + " " + ((oPoint.getSelected()) ? "selected" : "deselected"));
		},

		//product code

		onSelect: function (event) {
			if(event){
			var oPath = event.getParameter("listItem").getBindingContextPath();
			}
			var list = this.getView().byId("objectList");
			
			if(!oPath){
				oPath="/productTypes/0";
			}

			oPath = oPath + "/productList";
			list.bindItems(oPath, new sap.m.ObjectListItem({
					intro: "{productName}",
					icon: "{image}",
					number: "{amount}",
					title: "{brand}",
					numberUnit: "INR",
					type: "Active",
					 attributes:[
                       new sap.m.ObjectAttribute(
                       	{text:"{productId}"}
                       	)
                      ],
                 firstStatus:[
                       new sap.m.ObjectStatus(
                       	{text:"{=${quantity} > 50 ? 'Available' : ${quantity} <25 ? 'Low' : 'outOfStock'}"}
                       	// {
                       	// 	state:"{	path: 'quantity',formatter: 'sap.m.sample.ObjectListItem.Formatter.status'}"
                       		
                       	// }
                       	)
                       ]
			}
				)
			);
		},
		onItemSelect: function (event) {
debugger;
			var path = event.getParameter("listItem").getBindingContextPath();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var item = path.split("/")[path.split("/").length - 3];
			var itemName = path.split("/")[path.split("/").length - 2];
			var itemIndex = path.split("/")[path.split("/").length - 1];
			path = item + "." + itemName + "." + itemIndex;
			oRouter.navTo("DetailView", {
				itemName: path

			});
		},

		//Billing code

		onRequest: function () {

			if (!this.itemPopUp) {
				this.itemPopUp = new sap.m.SelectDialog({
					title: "ProductList",
					multiSelect: true,
					confirm: this.onItemConfirm.bind(this),
					liveChange: this.handleSearch.bind(this)
				});
				this.getView().addDependent(this.itemPopUp);
				this.itemPopUp.bindAggregation("items", {
					path: "/allProducts",
					template: new sap.m.ObjectListItem({
						title: "{productName}",
						number: "{amount}",
						numberUnit: "{productId}",
						icon: "{image}"
					})
				});
			}
			this.itemPopUp.open();
		},

		itemLength: null,
		oBill: [],
		onItemConfirm: function (oEvent) {
			var item = oEvent.getParameter("selectedItems");
			this.itemLength = item.length;
			var selectedItems = [];
			var itemsPrice = [];
			var itemsId = [];

			for (var i = 0; i < item.length; i++) {
				selectedItems.push(item[i].getTitle());
				itemsPrice.push(item[i].getNumber());
				itemsId.push(item[i].getNumberUnit());
			}
			var productInput=this.getView().byId("Product");
			selectedItems.forEach(function(items){
			productInput.addToken(new Token({text:items}));
			});
			var oTable = this.getView().byId("idBilling");

			oTable.setVisible(true);
				this.getView().byId("totalAmount").setVisible(true);
		
			for (var j = 0; j < item.length; j++) {
				var oBilling = {
					id: itemsId[j],
					name: selectedItems[j],
					price: itemsPrice[j],
					quantity: "1"
				};

				this.oBill.push(oBilling);
			}
			this.setData();

		},
		setData: function () {
			var ticketData = {
				bill: this.oBill
			};
			this.totalAmount=0;
			var model = new JSONModel(ticketData);
			this.getOwnerComponent().setModel(model, "billing");
			var oTable = this.getView().byId("idBilling");
			var totalBilling = this.getOwnerComponent().getModel("billing").getProperty("/bill");
			oTable.setVisibleRowCount(totalBilling.length);
			for (var i = 0; i < totalBilling.length; i++) {
				this.totalAmount =	this.totalAmount+(Number(totalBilling[i].price) * Number(totalBilling[i].quantity));
			}
			// this.getView().byId("totalAmount").setValue(this.totalAmount);
				this.getView().byId("totalAmount").setText("Total Amount = INR "+this.totalAmount+"Only ");
		},

		handleSelectionChange: function (oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var accessObj = {
				id: (Math.floor(Math.random() * 12345)).toString(),
				name: changedItem.getText(),
				price: changedItem.getKey(),
				quantity: "1"
			};
			this.oBill.push(accessObj);
			this.setData();
		},
		
		customerData: null,
		totalAmount: 0,
		raiseTicket: function () {

			var customerName = this.getView().byId("customerName").getValue();
			var customerNumber = this.getView().byId("customerNumber").getValue();
			var orderId = this.getView().byId("orderId").getValue();
			var valnumber = /^[0-9]+$/;
			if (customerName === "" && customerNumber === "" ) {
				MessageToast.show("Please fill the details");
			} else if (customerName === "") {
				MessageToast.show("Please fill the Customer Name");
			} else if (customerNumber === ""  ||  customerNumber.length!==10) {
				MessageToast.show("Please enter valid phone Number");
			} else if (!customerNumber.match(valnumber)) {
				MessageToast.show("Please enter  phone Number");
				
			} else if (this.oBill<1) {
				MessageToast.show("Please select the Product");
				
			}  
			
			else {
					this.totalAmount=0;
				 var totalBilling = this.getView().getModel("billing").getProperty("/bill");
				for (var i = 0; i < totalBilling.length; i++) {
				 	this.totalAmount +=(Number(totalBilling[i].price) * Number(totalBilling[i].quantity));

					this.productArr.push(totalBilling[i].name);
					this.productIdArr.push(totalBilling[i].id);
					this.quantityArr.push(totalBilling[i].quantity);
					this.priceArr.push(totalBilling[i].price);
				}
					this.totalAmount.toString();
				this.getView().byId("totalAmount").setText(this.totalAmount);
				this.customerData = {
					customerName: customerName,
					customerNumber: customerNumber,
					orderId: orderId
				};
				this.getPdf(totalBilling);
			}
		},
		productArr: [],
		productIdArr: [],
		quantityArr: [],
		priceArr: [],
		getPdf: function (totalBilling) {
			var amount = this.getView().byId("totalAmount").getText();
			this.getView().byId("idBilling").setVisible(false);
			this.getView().byId("Product").setVisible(true);
			this.getView().byId("ProductLabel").setVisible(true);
			var doc = new jsPDF();
			doc.setFillColor(51, 51, 51);
			doc.rect(1, 1, 208, 19, "FD");
			doc.rect(1, 1, 208, 250);
			doc.setFontType("bold");
			doc.setFontSize(20);
			doc.setTextColor(255, 255, 255);
			doc.text(80, 10, "Signiwis Sports");

			doc.setFontType("normal");
			doc.setFontSize(15);
			doc.setTextColor(0, 0, 0);
			doc.line(1, 20, 208, 20);
			doc.text(150, 30, "Date : " + this.today);
			doc.text(20, 60, "Name :  " + this.customerData.customerName);
			doc.text(20, 70, "Phone Number :  " + this.customerData.customerNumber);
			doc.text(20, 80, "OrderId :  " + this.customerData.orderId);
			doc.line(4, 90, 204, 90);
			doc.line(50, 90, 50, 170);
			doc.line(110, 90, 110, 170);
			doc.line(150, 90, 150, 170);

			doc.line(4, 90, 4, 170);
			doc.line(204, 90, 204, 170);

			doc.text(20, 100, "ProductId");
			doc.text(60, 100, " ProductName");
			doc.text(110, 100, " quantity");
			doc.text(160, 100, "Amount");

			doc.line(4, 105, 204, 105);

			doc.text(20, 115, this.productIdArr);
			doc.text(60, 115, this.productArr);
			doc.text(130, 115, this.quantityArr);
			doc.text(158, 115, this.priceArr);
			doc.line(4, 170, 204, 170);
			doc.setFontType("bold");
			doc.text(140, 200, "TotalAmount= INR" + amount);

			doc.save("booking.pdf");
				this.totalAmount=0;
				this.productArr=[];
				this.productIdArr=[];
				this.quantityArr=[];
				this.priceArr=[];
			var ticketData=[];
			this.oBill=[];
				var model = new JSONModel(ticketData);
			this.getOwnerComponent().setModel(model, "billing");
			  this.getView().byId("customerName").setValue("");
			  this.getView().byId("customerNumber").setValue("");
			  	this.getView().byId("totalAmount").setText("");
			  		this.getView().byId("Product").removeAllTokens();
			  			this.getView().byId("accessories").removeAllSelectedItems();
			  				//randon id 
			var orderVal = Math.floor(Math.random() * 12345);
			this.getView().byId("orderId").setValue(orderVal);
		},

		//                   Ticketing code

		itemArray: [],
		onRaiseTicket: function () {
			var oid = this.createId("fragTicketId");
			var productName = Fragment.byId(oid, "ticketProduct").getValue();
			var productId = Fragment.byId(oid, "ticketProductId").getValue();
			var quantity = Fragment.byId(oid, "ticketQuantity").getValue();
			if (productName === "" || productId === "") {
				MessageToast.show("Please select the Product");
			} else if(quantity === ""){
					MessageToast.show("Please Provide the quantity");
			}
			else {
				var ticketObject = {
					pName: productName,
					pId: productId,
					pQuantity: quantity,
					pImage: this.image,
					pStatus: "InProcess",
					status: "InProcess"
				};
				this.itemArray.push(ticketObject);
				var ticketData = {
					raiseTicket: this.itemArray
				};

				var model = new JSONModel(ticketData);
				this.getOwnerComponent().setModel(model, "ticketing");
				
					var oTable = this.getView().byId("ticketingTable");

			oTable.setVisible(true);
			oTable.setVisibleRowCount(this.itemArray.length);

				Fragment.byId(oid, "ticketProduct").setValue("");
				Fragment.byId(oid, "ticketProductId").setValue("");
				Fragment.byId(oid, "ticketQuantity").setValue("");
				this.onTicketClose();
			}
		},

		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter1 = new Filter("productName", FilterOperator.Contains, sValue);
			var oFilter2 = new Filter("brand", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			var oFilter = [oFilter1, oFilter2];
			oBinding.filter([oFilter]);
		},

		onTicketClose: function () {
			this.oTicketPopUp.close();

		},

		oTicketPopUp: null,
		oTicketEvent: null,
		onAddTicket: function (oEvent) {
			debugger;
			this.getView().byId("date").setValue(this.today);
			this.oTicketEvent = oEvent.getParameter("selectedItem").getText();
			if (this.oTicketEvent === "Ticketing") {
				if (!this.oTicketPopUp) {
					var oid = this.createId("fragTicketId");
					this.oTicketPopUp = new sap.ui.xmlfragment(oid, "SS.SigniwisSports.view.ticket", this);
					this.getView().addDependent(this.oTicketPopUp);
					Fragment.byId(oid, "ticketDate").setValue(this.today);
				}
				this.oTicketPopUp.open();
			}
		},
		oProductPopup: null,
		onTicketRequest: function () {
			debugger;
			if (!this.oProductPopup) {
				this.oProductPopup = new sap.m.SelectDialog({
					title: "ProductList",
					confirm: this.onTicketItemConfirm.bind(this),
					liveChange: this.handleSearch.bind(this)
				});
				this.getView().addDependent(this.oProductPopup);
				this.oProductPopup.bindAggregation("items", {
					path: "/allProducts",
					template: new sap.m.ObjectListItem({
						title: "{productName}",
						number: "{amount}",
						numberUnit: "{productId}",
						icon: "{image}"
					})
				});
			}
			this.oProductPopup.open();
		},
		onTicketItemConfirm: function (oEvent) {
				var item = oEvent.getParameter("selectedItem");
				var oid = this.createId("fragTicketId");
				Fragment.byId(oid, "ticketProduct").setValue(item.getTitle());
				Fragment.byId(oid, "ticketProductId").setValue(item.getNumberUnit());
				this.image = item.getIcon();
			//	console.log(Fragment.byId(oid, "ticketProductId").getValue());

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf SS.SigniwisSports.view.SalesLogin
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf SS.SigniwisSports.view.SalesLogin
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf SS.SigniwisSports.view.SalesLogin
		 */
		//	onExit: function() {
		//
		//	}

	});

});
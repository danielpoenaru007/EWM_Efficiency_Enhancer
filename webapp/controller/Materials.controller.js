sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("bearingpoint.ewm.materialmaintenance.controller.Materials", {
            onInit: function () {
                var oSmartTable = this.getView().byId("LineItemsSmartTable");
                this.table = oSmartTable.getTable();
                this.table.attachSelectionChange(this.onTableSelectionChange.bind(this));
            },

            onTableSelectionChange: function (oEvent) {
                var aSelectedItems = this.table.getSelectedItems(), bCreate = true, bMassChange = true, that = this;

                if(aSelectedItems.length > 0){
                   var sPrewValue = aSelectedItems[0].getBindingContext().getObject().WarehouseNo;
                   aSelectedItems.forEach(function(element){
                     if (element.getBindingContext().getObject().WarehouseNo !== ''){
                        bCreate = false;
                       
                     }
                       
                      if (element.getBindingContext().getObject().WarehouseNo !== '' && element.getBindingContext().getObject().WarehouseNo != sPrewValue  ){
                        bMassChange = false;
                       that.messageInformationDialog()
                        // sap.m.MessageToast.show("Mass Change is available only for lines with same warehouse. Please select a row with same Warehouse");
                      }
                           
                   })
                }
                    
                if (aSelectedItems.length > 1 && bMassChange === true) 
                    this.getView().byId("_MassChange").setEnabled(true);
                else 
                    this.getView().byId("_MassChange").setEnabled(false);


                if (aSelectedItems.length > 0 && bCreate === true)
                    this.getView().byId("_IDGenButton").setEnabled(true);
                else 
                    this.getView().byId("_IDGenButton").setEnabled(false);

            },

            messageInformationDialog: function () {
                if (!this.oInfoMessageDialog) {
                    this.oInfoMessageDialog = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: "Information",
                        state: sap.ui.core.ValueState.Information,
                        content: new sap.m.Text({ text: this.getView().getModel("i18n").getResourceBundle().getText("massChangeInfo")}), //Mass Change is available only for lines with same warehouse. Please select a row with same Warehouse" }),
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oInfoMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }
    
                this.oInfoMessageDialog.open();
            },

            // onDialogOpen: function () {
            //     this.oSubmitButton = new sap.m.Button({
            //         text: 'Submit',
            //         enabled: false,
            //         press: function () {
            //             this.onCreateMaterials(this.table);
            //             this.oDialog.close();
            //         }.bind(this)
            //     })
            //     var oSmartField = new sap.ui.comp.smartfield.SmartField({
            //         textLabel: "Warehouse",
            //         change: this.onChangeSmartfield.bind(this),

            //         value: {
            //             path: 'Warehouse'
            //         }
            //     }).setModel(this.getView().getModel());
            //     oSmartField.bindElement(this.table.getItems()[0].getBindingContextPath());

            //     if (!this.oDialog) {
            //         this.oDialog = new sap.m.Dialog({
            //             title: 'Warehouse',
            //             type: 'Message',
            //             content: oSmartField,
            //             buttons: [this.oSubmitButton, new sap.m.Button({
            //                 text: 'Cancel',
            //                 press: function () {
            //                     this.oDialog.close();
            //                 }.bind(this)
            //             })],
            //             afterClose: function () {
            //                 //this.oDialog.destroy();
            //             }.bind(this)
            //         });
            //         //to get access to the view models
            //         this.getView().addDependent(this.oDialog);
            //     }
            //     this.oDialog.open();
            // },

            onChangeSmartfield: function (oEvent) {
                if (oEvent.getParameter("value") !== "" || oEvent.getParameter("newValue") !== "") {
                    this.oSubmitButton.setEnabled(true);
                } else {
                    this.oSubmitButton.setEnabled(false);
                }
            },

            onCreate: function (oEvent) {
                var fragmentPromise,
                    that = this;

                if( !this.oDialog) {
                    fragmentPromise = this.loadFragment({
                        name: "bearingpoint.ewm.materialmaintenance.view.fragments.Create"
                    });
                    fragmentPromise.then(function (oDialog){
                        // create an entry in the Products collection with the specified properties and values as initial data
                        that.oContextNewEntry = that.createNewEntry();
                        that.getView().byId("sfCreate").setBindingContext(that.oContextNewEntry);
                        that.oDialog = oDialog;
                        oDialog.open();
                    });
                }else{
                    // create an entry in the Products collection with the specified properties and values as initial data
                    that.oContextNewEntry = that.createNewEntry();
                    that.getView().byId("sfCreate").setBindingContext(that.oContextNewEntry);
                    this.oDialog.open();
                }
            },

            onChangeWH: function(oEvent){
                var aSelectedItems = this.table.getSelectedItems(), that = this;
                var sDialogWHValue = this.getView().byId("warehouseNo").getValue();
                if (this.getView().byId("warehouseNo").getValue() != ""){
                    that.getView().getModel().setProperty("WarehouseNo", sDialogWHValue ? sDialogWHValue : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).Warehouse , that.oContextNewEntry);
                    aSelectedItems.forEach(function(oItem){
                        let oContext = oItem.getBindingContext();
                        let oDialogObject = that.getView().getModel().getProperty(that.oContextNewEntry.sPath)
                        that.getView().getModel().setProperty("WarehouseNo", oDialogObject.Warehouse ? oDialogObject.Warehouse : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).Warehouse , oContext);
                        // that.getView().getModel().setProperty("Warehouse", oDialogObject.Warehouse ? oDialogObject.Warehouse : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).Warehouse , oContext);
                        // that.getView().getModel().setProperty("PutawayControl", oDialogObject.PutawayControl ? oDialogObject.PutawayControl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).PutawayControl , oContext);
                        // that.getView().getModel().setProperty("StorSectInd", oDialogObject.StorSectInd ? oDialogObject.StorSectInd : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StorSectInd , oContext);
                        // that.getView().getModel().setProperty("StockRemovalCtrl", oDialogObject.StockRemovalCtrl ? oDialogObject.StockRemovalCtrl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StockRemovalCtrl , oContext);
                        // that.getView().getModel().setProperty("BulkStorage", oDialogObject.BulkStorage ? oDialogObject.BulkStorage : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).BulkStorage , oContext);
                    });
                    this.getView().getModel().updateBindings(true);
                    this.getView().byId("warehouseNo").setValueState(sap.ui.core.ValueState.None);
                }
            },

            onChangeEntitled: function(oEvent){ 
                if (this.getView().byId("entitled").getValue() != ""){
                    this.getView().byId("entitled").setValueState(sap.ui.core.ValueState.None);
                }
            },

            onCreateWarehouse: function(){
                var aSelectedItems = this.table.getSelectedItems();
                var oDialogObject = this.getView().getModel().getProperty(this.oContextNewEntry.sPath)
                if ( oDialogObject.Warehouse == "" || this.getView().byId("warehouseNo").getValue() == "" ){
                    this.getView().byId("warehouseNo").setValueState(sap.ui.core.ValueState.Error);
                    return;
                }

                if ( oDialogObject.Entitled == "" || this.getView().byId("entitled").getValue() == "" ){
                    this.getView().byId("entitled").setValueState(sap.ui.core.ValueState.Error);
                    return;
                }
                

                var that = this;

                aSelectedItems.forEach(function(oItem){
                    let oContext = oItem.getBindingContext();
                    //that.getView().getModel().setProperty("WarehouseNo", oDialogObject.Warehouse ? oDialogObject.Warehouse : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).Warehouse , oContext);
                    that.getView().getModel().setProperty("Warehouse", oDialogObject.Warehouse ? oDialogObject.Warehouse : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).Warehouse , oContext);
                    that.getView().getModel().setProperty("PutawayControl", oDialogObject.PutawayControl ? oDialogObject.PutawayControl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).PutawayControl , oContext);
                    that.getView().getModel().setProperty("StorSectInd", oDialogObject.StorSectInd ? oDialogObject.StorSectInd : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StorSectInd , oContext);
                    that.getView().getModel().setProperty("StockRemovalCtrl", oDialogObject.StockRemovalCtrl ? oDialogObject.StockRemovalCtrl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StockRemovalCtrl , oContext);
                    that.getView().getModel().setProperty("BulkStorage", oDialogObject.BulkStorage ? oDialogObject.BulkStorage : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).BulkStorage , oContext);
                });

                this.deleteModelEntry(this.oContextNewEntry); 
                this.onSaveData();
                this.oDialog.close();

            },

            closeCreateDialog: function () {
                this.deleteModelEntry(this.oContextNewEntry);
                this.oDialog.close();
            },

            createNewEntry: function(){
                var aSelectedItems = this.table.getSelectedItems();
                var oFirstItemContext = aSelectedItems[0].getBindingContext();
                var oItemData = this.getView().getModel().getProperty(oFirstItemContext.sPath);
                if ( oItemData.WarehouseNo !== "")
                    return  this.getView().getModel().createEntry("/ZEWM_C_MATERIAL", { properties: { WarehouseNo : oItemData.WarehouseNo} });
                else
                    return  this.getView().getModel().createEntry("/ZEWM_C_MATERIAL");
                },

            deleteModelEntry(oContext){
                this.getView().getModel().deleteCreatedEntry(oContext);
            },

            onMassChange: function(oEvent){
                var fragmentPromise,
                that = this;

                if( !this.oMassDialog) {
                    fragmentPromise = this.loadFragment({
                        name: "bearingpoint.ewm.materialmaintenance.view.fragments.MassChange"
                    });
                    fragmentPromise.then(function (oDialog){
                        that.oMassDialog = oDialog;
                        // create an entry in the Products collection with the specified properties and values as initial data
                        that.oContextNewEntry = that.createNewEntry();
                        that.getView().byId("SF1").setBindingContext(that.oContextNewEntry);
                        that.getView().byId("LineItemsSmartTable").setEditable(true);
                        that.onEditToggled();
                        oDialog.open();
                    });
                }else{
                    that.oContextNewEntry = that.createNewEntry();
                    that.getView().byId("SF1").setBindingContext(that.oContextNewEntry);
                    this.oMassDialog.open();that.getView().byId("LineItemsSmartTable").setEditable(true);
                    that.onEditToggled();
                }

            },

            _closeDialog: function () {
                this.deleteModelEntry(this.oContextNewEntry);
                this.oMassDialog.close();
            },

            applyMassChange: function(oEvent){

                var aSelectedItems = this.table.getSelectedItems();
                var oDialogObject = this.getView().getModel().getProperty(this.oContextNewEntry.sPath)
                var that = this;

                aSelectedItems.forEach(function(oItem){
                    let oContext = oItem.getBindingContext();
                    that.getView().getModel().setProperty("PutawayControl", oDialogObject.PutawayControl ? oDialogObject.PutawayControl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).PutawayControl , oContext);
                    that.getView().getModel().setProperty("StorSectInd", oDialogObject.StorSectInd ? oDialogObject.StorSectInd : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StorSectInd , oContext);
                    that.getView().getModel().setProperty("StockRemovalCtrl", oDialogObject.StockRemovalCtrl ? oDialogObject.StockRemovalCtrl : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).StockRemovalCtrl , oContext);
                    that.getView().getModel().setProperty("BulkStorage", oDialogObject.BulkStorage ? oDialogObject.BulkStorage : that.getView().getModel().getProperty(oItem.getBindingContext().sPath).BulkStorage , oContext);
                });

                this.deleteModelEntry(this.oContextNewEntry);
                this.oMassDialog.close();
            },

            onEditToggled: function (oEvent) {
                var oSmartTable = this.getView().byId("LineItemsSmartTable");// oEvent.getSource();
                var oSmartTableToolbarContent = oSmartTable.getToolbar().getContent();

                function isEditButton(element) {
                    try {
                        if (element.getProperty("accesskey") == "d")
                            return element;
                    } catch (error) {

                    }
                }
                var oEditToggleBtn = oSmartTableToolbarContent.find(isEditButton);

                // var oEditToggleBtn = sap.ui.getCore().byId("container-smarttable---ViewSmartTable--LineItemsSmartTable-btnEditToggle");

                if (oSmartTable.getEditable()) {
                    // Toggle to Save Mode
                    oEditToggleBtn.setIcon("sap-icon://save");

                } else {
                    // Toggle to Edit Mode
                    oEditToggleBtn.setIcon("sap-icon://edit");

                    // Save Data to database
                    this.onSaveData();
                }
            },

            onSaveData: function () {

                if (this.getView().getModel().hasPendingChanges()) {
                    this.getView().getModel().submitChanges({
                        success: function (oData) {
                            sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("saveSuccessMessage")); //"Data are Saved");
                            this.getView().getModel().refresh();
                        }.bind(this),
                        error: function (oError) { 
                            sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("saveErrorMessage")); //"An error appear, please try again!");
                        }
                    });

                }
            }
        });
    });

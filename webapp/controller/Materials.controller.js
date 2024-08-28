sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("bearingpoint.ewm.materialmaintenance.controller.Materials", {
        onInit: function () {

        },

        onEditToggled: function (oEvent) {
            var oSmartTable = oEvent.getSource();
            var oSmartTableToolbarContent = oSmartTable.getToolbar().getContent();

            function isEditButton (element){
                try {
                    if ( element.getProperty("accesskey") == "d" )
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
            var oModel = this.getView().getModel("yourModel");

            // Trigger the submitChanges method to save the edits
            // oModel.submitChanges({
            //     success: function () {
            //         MessageToast.show("Changes saved successfully.");
            //     },
            //     error: function () {
            //         MessageToast.show("Failed to save changes.");
            //     }
            // });
        }
    });
});

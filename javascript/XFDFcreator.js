document.addEventListener('DOMContentLoaded', () => {
    const smartPackRequestor = document.getElementById('smartPackRequestor');

    if (smartPackRequestor) {
        smartPackRequestor.addEventListener('click', function(event) {
            event.preventDefault();
            const formData = populateFormData();
            const xfdfContent = createXFDF(formData);

            const blob = new Blob([xfdfContent], { type: 'application/vnd.adobe.xfdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'formdata.xfdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } else {
        console.error('Button element not found');
    }
});



// Get the value of the URN field and trim it
function populateFormData() {
    var EX1inputs = document.querySelectorAll('input[id^="EX-"]');
    var EX1fill = Array.from(EX1inputs).some(input => input.value.trim() !== "") ? "Yes" : "No";

    var URNvalue = document.getElementById('URN').value.trim();
    var flexValue = document.getElementById('flexNum').value.trim();
    // Check if URN has a value and isn't blank
    var dwpDataMatched = URNvalue !== "" ? "Yes" : "No";
    var flexMatched = flexValue !== "" ? "Yes" : "No";
    var dwpURNvalue = flexValue !== "" ? flexValue : URNvalue;

    var schemeSelectValue = document.getElementById('schemeSelect').value.trim();
    var gbisValue = (schemeSelectValue === "GBIS" || schemeSelectValue === "General Eligibility") ? "GBIS" : "";

    // Check which tax band is selected
    function getSelectedTaxBand() {
        if (document.getElementById('tbA').checked) return 'A';
        if (document.getElementById('tbB').checked) return 'B';
        if (document.getElementById('tbC').checked) return 'C';
        if (document.getElementById('tbD').checked) return 'D';
        if (document.getElementById('tbE').checked) return 'E';
        if (document.getElementById('tbF').checked) return 'F';
        if (document.getElementById('tbG').checked) return 'G';
        if (document.getElementById('tbH').checked) return 'H';
        return ''; // No tax band selected
    }
    const selectedTaxBand = getSelectedTaxBand();
    const tbPresent = selectedTaxBand ? "Yes" : "No"; // Set to "Yes" if any tax band is selected

    console.log("Script is running");

    const formData = {
        [`Council Tax Band ${selectedTaxBand}`]: "Yes", // Dynamically set the property name
        "General Eligibility Job": tbPresent, // Set based on tax band selection

        "Customer Name": `${document.getElementById('fName').value.trim()} ${document.getElementById('mName').value.trim()} ${document.getElementById('sName').value.trim()}`,
        "Customer Phone": document.getElementById('tel').value.trim(),
        "Customer Address": `${document.getElementById('street').value.trim()}, ${document.getElementById('town').value.trim()}, ${document.getElementById('postcode').value.trim()}`,
        "DWP URN": dwpURNvalue, // Use the combined URN or Flex value
        "DWP Data Matched": dwpDataMatched,      
        "LA Flex Job": flexMatched,
        "Tenure type": document.getElementById('tenancySelect').value.trim(),
        "Landlord": document.getElementById('landlord').value.trim(),

        "Scheme": gbisValue,
        "Survey Date": document.getElementById('surveyDate').value.trim(),
        "Survey Lodgement Date": document.getElementById('submissionDate').value.trim(),
        "Dwelling type": document.getElementById('propertyType').value.trim(),
        "Total Floor Area m2": document.getElementById('totalFloorArea').value.trim(),
        "SAP Rating": document.getElementById('SAPrating').value.trim(),
        "EPC reference number": document.getElementById('rdsapNum').value.trim(),
        "Wall Age": document.getElementById('YOpropSelect').value.trim(),

        "PAS Measure 1": document.getElementById('m1measureList').value.trim(),
        "PAS Measure 1 Material Text": document.getElementById('m1material').value.trim(),
        "PAS Measure 1 Install Company": document.getElementById('m1installerCompany').value.trim(),
        "PAS Measure 1 Installer": document.getElementById('m1installerName').value.trim(),
        "PAS Measure 1 Cert": document.getElementById('m1PAScertNum').value.trim(),

        "Existing Radiator Count": document.getElementById('radNum').value.trim(),

        "Main Present": "Yes",
        "Main Wall Construction": document.getElementById('wallConstructSelect').value.trim(),
        "Main Room Height 1": document.getElementById('roomHeight').value.trim(),
        "Main Room Height 2": document.getElementById('roomHeight2').value.trim(),
        "Main Wall Perimeter 1": document.getElementById('wallPerimeter').value.trim(),
        "Main Wall Perimeter 2": document.getElementById('wallPerimeter2').value.trim(),
        "Main Roof Type": document.getElementById('roofType').value.trim(),
        "Main Roof Area": document.getElementById('floorArea').value.trim(),
        "Main Roof Area 2": document.getElementById('floorArea2').value.trim(),

        "Handover Date": document.getElementById('installDateInput').value.trim(),

        /* EXTENSIONS 
        PUT IN CODE TO CHECK EX1 PRESENT WHEN WRITTEN IN */

        "Extension 1 Present": EX1fill,
        "Extension 1 Wall Construction": document.getElementById('EX-wallConstructSelect').value.trim(),
        "Extension 1 Room Height 1": document.getElementById('EX-roomHeight').value.trim(),
        "Extension 1 Room Height 2": document.getElementById('EX-roomHeight2').value.trim(),
        "Extension 1 Wall Perimeter 1": document.getElementById('EX-wallPerimeter').value.trim(),
        "Extension 1 Wall Perimeter 2": document.getElementById('EX-wallPerimeter2').value.trim(),
        "Extension 1 Roof Type": document.getElementById('EX-roofType').value.trim(),
        "Extension 1 Roof Area": document.getElementById('EX-floorArea').value.trim(),
        "Extension 1 Roof Area 2": document.getElementById('EX-floorArea2').value.trim(),

        /* MORE MEASURES */
        "PAS Measure 2": document.getElementById('m2measureList').value.trim(),
        "PAS Measure 2 Material Text": document.getElementById('m2material').value.trim(),
        "PAS Measure 2 Install Company": document.getElementById('m2installerCompany').value.trim(),
        "PAS Measure 2 Installer": document.getElementById('m2installerName').value.trim(),
        "PAS Measure 2 Cert": document.getElementById('m2PAScertNum').value.trim(),

        "PAS Measure 3": document.getElementById('m3measureList').value.trim(),
        "PAS Measure 3 Material Text": document.getElementById('m3material').value.trim(),
        "PAS Measure 3 Install Company": document.getElementById('m3installerCompany').value.trim(),
        "PAS Measure 3 Installer": document.getElementById('m3installerName').value.trim(),
        "PAS Measure 3 Cert": document.getElementById('m3PAScertNum').value.trim(),

        "PAS Measure 4": document.getElementById('m4measureList').value.trim(),
        "PAS Measure 4 Material Text": document.getElementById('m4material').value.trim(),
        "PAS Measure 4 Install Company": document.getElementById('m4installerCompany').value.trim(),
        "PAS Measure 4 Installer": document.getElementById('m4installerName').value.trim(),
        "PAS Measure 4 Cert": document.getElementById('m4PAScertNum').value.trim(),

        "PAS Measure 5": document.getElementById('m5measureList').value.trim(),
        "PAS Measure 5 Material Text": document.getElementById('m5material').value.trim(),
        "PAS Measure 5 Install Company": document.getElementById('m5installerCompany').value.trim(),
        "PAS Measure 5 Installer": document.getElementById('m5installerName').value.trim(),
        "PAS Measure 5 Cert": document.getElementById('m5PAScertNum').value.trim(),
    };

    for (let measureIndex = 1; measureIndex <= 5; measureIndex++) {
        // Dynamically construct the dropdown ID
        var dropdownId = 'm' + measureIndex + 'measureList';  // No '#' symbol here
        
        // Get the dropdown element
        var dropdownElement = document.getElementById(dropdownId);
        
        // Log the dropdown element to verify it exists
        console.log(`Checking element with ID: ${dropdownId}`, dropdownElement);
        
        // Only handle the element if it exists
        if (dropdownElement) {
            const selectedMeasure = dropdownElement.value;
            console.log(`Selected measure: ${selectedMeasure}`);

            // Simplified if statements for each measure
            if (selectedMeasure === "CWI") {
                formData["CWI Installed"] = "Yes";
            } else if (selectedMeasure === "IWI") {
                formData["IWI Installed"] = "Yes";
            } else if (selectedMeasure === "EWI") {
                formData["EWI Installed"] = "Yes";
            } else if (selectedMeasure === "GB") {
                formData["Boiler Upgrade Installed"] = "Yes", formData["Load Comp Installed"] = "Yes";
            } else if (selectedMeasure === "FTCH") {
                formData["FTCH Installed"] = "Yes";
            } else if (selectedMeasure === "ESH") {
                formData["ESH Upgrade Installed"] = "Yes";
            } else if (selectedMeasure === "LI") {
                formData["LI Installed"] = "Yes", formData["Loft Insulation 100 or less"] = "Yes", formData["Loft Start Depth"] = "0", formData["Loft Final Depth"] = "300";
            } else if (selectedMeasure === "FRI") {
                formData["FRI Installed"] = "Yes";
            } else if (selectedMeasure === "RIRI") {
                formData["RIRI Installed"] = "Yes";
            } else if (selectedMeasure === "PRT") {
                formData["PRT Installed"] = "Yes";
            } else if (selectedMeasure === "HC") {
                formData["PRT Installed"] = "Yes", formData["TRVs Installed"] = "Yes";
            } else if (selectedMeasure === "TRV") {
                formData["TRV Installed"] = "Yes";
            } else if (selectedMeasure === "SPV") {
                formData["SPV Installed"] = "Yes";
            } else if (selectedMeasure === "ST") {
                formData["Smart Thermostat Installed"] = "Yes";
            } else if (selectedMeasure === "TTZC") {
                formData["TTZC Installed"] = "Yes", formData["Existing Heating Controls"] = "Yes", formData["Existing Programmer"] = "Yes",
                formData["Existing Room Thermostat"] = "Yes", formData["Existing TRV"] = "Yes", formData["Property On Gas"] = "Yes", formData["Yes Bypass"] = "Yes";
            }
        }
    }

    // Get the selected value from the "Occupancy Evidence" dropdown
    const selectedEvidence = document.getElementById('occupancyEvidenceDropdown').value.trim();
    // Switch case to set the correct formData value for "Utility bill"
    switch (selectedEvidence) {
        case "Utility bill": formData["Utility bill"] = "Yes";
            break;
        case "Mortgage Statement": formData["Mortgage Statement"] = "Yes";
            break;
        case "NHS Letter": formData["NHS Letter"] = "Yes";
            break;
        case "Other": formData["Other"] = "Yes";
            break;
        default: formData["Utility bill"] = "No";  // Default to "No" if none is selected
            break;
    }

    const selectedProperty = document.getElementById('propertyType').value.trim();   
    // Arrays to match property types
    const houseTypes = ['Semi-Detached House', 'Detached House', 'End-Terrace House', 'Mid-Terrace House', 'Bungalow'];
    const flatTypes = ['Top Floor Flat', 'Mid Floor Flat', 'Ground Floor Flat', 'Top Floor Maisonette', 'Mid Floor Maisonette', 'Ground Floor Maisonette', 'Studio Flat'];
    const parkHomeTypes = ['Park Home'];
    
    // Check and set the "Dwelling type"
    if (houseTypes.includes(selectedProperty)) {
        formData["Dwelling type"] = "House";
    } else if (flatTypes.includes(selectedProperty)) {
        formData["Dwelling type"] = "Flat";
    } else if (parkHomeTypes.includes(selectedProperty)) {
        formData["Dwelling type"] = "Park Home";
    } else {
        formData["Dwelling type"] = ""; // Default value if none matches
    }

    // MEASURES FILL OUTS

    console.log(formData);

    return formData;
}


function createXFDF(formData) {
    let xfdfContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xfdfContent += '<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">\n';
    xfdfContent += '  <fields>\n';

    for (const [key, value] of Object.entries(formData)) {
        xfdfContent += `    <field name="${escapeXML(key)}">\n`;
        xfdfContent += `      <value>${escapeXML(value)}</value>\n`;
        xfdfContent += '    </field>\n';
    }

    xfdfContent += '  </fields>\n';
    xfdfContent += '</xfdf>\n';

    return xfdfContent;
}

function escapeXML(str) {
    if (typeof str !== 'string') {
        console.log("Error with string.")
        return ''; // or return str if you want to keep it unchanged when it's not a string
    }
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}


/* 
function ToggleSectionDimensions(section, on=false)
{
    fields = [
        this.getField(section + " Wall Construction"), 
        this.getField(section + " Alt Wall Construction"), 
        this.getField(section + " Room Height 1"), 
        this.getField(section + " Room Height 2"), 
        this.getField(section + " Room Height 3"), 
        this.getField(section + " Room Height 4"), 
        this.getField(section + " Wall Perimeter 1"), 
        this.getField(section + " Wall Perimeter 2"), 
        this.getField(section + " Wall Perimeter 3"), 
        this.getField(section + " Wall Perimeter 4"), 
        this.getField(section + " Alt Wall Area"), 
        this.getField(section + " Insulation Area Installed"), 
        this.getField(section + " Alt Insulation Area Installed"), 
        this.getField(section + " Roof Type"), 
        this.getField(section + " Roof Area"), 
        this.getField(section + " Roof Insulation Area Installed"), 
        this.getField(section + " Roof Insulation Type")
    ];
    
    for (var i = 0; i < fields.length; i++)
    {
        fields[i].display = on ? display.visible : display.hidden;
        fields[i].readonly = !on;
    }
} 
    */
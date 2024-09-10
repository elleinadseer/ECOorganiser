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
    var URNvalue = document.getElementById('URN').value.trim();
    var flexValue = document.getElementById('flexNum').value.trim();

    var schemeSelectValue = document.getElementById('schemeSelect').value.trim();

    // Check if URN has a value and isn't blank
    var dwpDataMatched = URNvalue !== "" ? "Yes" : "No";
    var flexMatched = flexValue !== "" ? "Yes" : "No";
    var dwpURNvalue = flexValue !== "" ? flexValue : URNvalue;

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

        "Extension 1 Present": document.getElementById('EX-prop').checked,
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
    };

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
        default: formData["Utility Bill"] = "No";  // Default to "No" if none is selected
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
    
    return formData;
}

console.log(formData);

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
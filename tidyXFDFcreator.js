document.addEventListener('DOMContentLoaded', () => {
    const smartPackRequestor = document.getElementById('smartPackRequestor');

    if (smartPackRequestor) {
        smartPackRequestor.addEventListener('click', function(event) {
            event.preventDefault();
            const formData = formDataProcessor.populateFormData(); // Update this line in the event listener
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


const formDataProcessor = (() => {
    const formData = {};

    // Value functions 
    const getVal = (id) => document.getElementById(id).value.trim();
    const getYN = (value) => value !== "" ? "Yes" : "No";

    // Checks EX presence 
    const checkEX1Inputs = () => {
        const EX1inputs = document.querySelectorAll('input[id^="EX-"]');
        return Array.from(EX1inputs).some(input => input.value.trim() !== "") ? "Yes" : "No";
    };

    // Checks tax band checked
    const checkTaxBand = () => {
        const taxBands = ['tbA', 'tbB', 'tbC', 'tbD', 'tbE', 'tbF', 'tbG', 'tbH'];
        for (const band of taxBands) {
            if (document.getElementById(band).checked) {
                return band.replace('tb', ''); // Returns tax band letter
            }
        }
        return ''; // No tax band selected
    };


    const populateFormData = () => {
        const formData = {};

        // URN / flex
        const URNvalue = getVal('URN');
        const flexValue = getVal('flexNum');
        const dwpURNvalue = flexValue !== "" ? flexValue : URNvalue;

        // tax band
        const selectedTaxBand = checkTaxBand();
        const tbPresent = getYN(selectedTaxBand); // ugly code, change
        
        const complexFields = {
            "Customer Name": [getVal('fName'), getVal('mName'), getVal('sName')].join(' '),
            "Customer Address": [getVal('street'), getVal('town'), getVal('postcode')].join(', '),
            "Scheme": (getVal('schemeSelect') === "GBIS" || getVal('schemeSelect') === "General Eligibility") ? "GBIS" : "",

            "DWP Data Matched": getYN(URNvalue),
            "LA Flex Job": getYN(flexValue),
            "DWP URN": dwpURNvalue,

            "Extension 1 Present": checkEX1Inputs(),
            "General Eligibility Job": tbPresent,

            [`Council Tax Band ${selectedTaxBand}`]: "Yes",
        };
        
        // Define fields that require getVal
        const valuedFields = {
            "Customer Phone": 'tel',
            "Landlord": 'landlord',
            "Survey Date": 'surveyDate',
            "Survey Lodgement Date": 'submissionDate',
            "Dwelling type": 'propertyType',

            "Extension 1 Wall Construction": 'EX-wallConstructSelect',
            "Extension 1 Room Height 1": 'EX-roomHeight',
            "Extension 1 Room Height 2": 'EX-roomHeight2',
            "Extension 1 Wall Perimeter 1": 'EX-wallPerimeter',
            "Extension 1 Wall Perimeter 2": 'EX-wallPerimeter2',
            "Extension 1 Roof Type": 'EX-roofType',
            "Extension 1 Roof Area": 'EX-floorArea',
            "Extension 1 Roof Area 2": 'EX-floorArea2',
    
            /*MEASURES */
            "PAS Measure 1": 'm1measureList',
            "PAS Measure 1 Material Text": 'm1material',
            "PAS Measure 1 Install Company": 'm1installerCompany',
            "PAS Measure 1 Installer": 'm1installerName',
            "PAS Measure 1 Cert": 'm1PAScertNum',

            "PAS Measure 2": 'm2measureList',
            "PAS Measure 2 Material Text": 'm2material',
            "PAS Measure 2 Install Company": 'm2installerCompany',
            "PAS Measure 2 Installer": 'm2installerName',
            "PAS Measure 2 Cert": 'm2PAScertNum',
    
            "PAS Measure 3": 'm3measureList',
            "PAS Measure 3 Material Text": 'm3material',
            "PAS Measure 3 Install Company": 'm3installerCompany',
            "PAS Measure 3 Installer": 'm3installerName',
            "PAS Measure 3 Cert": 'm3PAScertNum',
    
            "PAS Measure 4": 'm4measureList',
            "PAS Measure 4 Material Text": 'm4material',
            "PAS Measure 4 Install Company": 'm4installerCompany',
            "PAS Measure 4 Installer": 'm4installerName',
            "PAS Measure 4 Cert": 'm4PAScertNum',
    
            "PAS Measure 5": 'm5measureList',
            "PAS Measure 5 Material Text": 'm5material',
            "PAS Measure 5 Install Company": 'm5installerCompany',
            "PAS Measure 5 Installer": 'm5installerName',
            "PAS Measure 5 Cert": 'm5PAScertNum',         
        };

        // Populate formData with all fields
        Object.assign(formData, complexFields);
        Object.keys(valuedFields).forEach(key => {
            formData[key] = getVal(valuedFields[key]);
        });

        processMeasures();
        processOccupancyEvidence();
        categoriseDwellingType();

        return formData; 
    };


    // -- MEASURE PROCESS -- 
    const processMeasures = () => {
        for (let measureIndex = 1; measureIndex <= 5; measureIndex++) {
            const selectedMeasure = getVal(`m${measureIndex}measureList`);
            if (selectedMeasure) {
                handleMeasure(selectedMeasure);
            }
        }
    };

    const handleMeasure = (selectedMeasure) => {
        const measureMap = {
            "CWI": "CWI Installed",
            "IWI": "IWI Installed",
            "EWI": "EWI Installed",
            "GB": ["Boiler Upgrade Installed", "Load Comp Installed"],
            "FTCH": "FTCH Installed",
            "ESH": "ESH Upgrade Installed",
            "LI": ["LI Installed", "Loft Insulation 100 or less", "Loft Start Depth", "Loft Final Depth"],
            "FRI": "FRI Installed",
            "RIRI": "RIRI Installed",
            "PRT": "PRT Installed",
            "HC": ["PRT Installed", "TRVs Installed"],
            "TRV": "TRV Installed",
            "SPV": "SPV Installed",
            "ST": "Smart Thermostat Installed",
            "TTZC": ["TTZC Installed", "Existing Heating Controls", "Existing Programmer", "Existing Room Thermostat", "Existing TRV", "Property On Gas", "Yes Bypass"],
        };

        if (measureMap[selectedMeasure]) {
            const measures = Array.isArray(measureMap[selectedMeasure]) ? measureMap[selectedMeasure] : [measureMap[selectedMeasure]];
            measures.forEach(measure => {
                formData[measure] = "Yes";
            });
        }
    };

    const processOccupancyEvidence = () => {
        const selectedEvidence = getVal('occupancyEvidenceDropdown');
        const evidenceMap = {
            "Utility bill": "Utility bill",
            "Mortgage Statement": "Mortgage Statement",
            "NHS Letter": "NHS Letter",
            "Other": "Other"
        };

        if (evidenceMap[selectedEvidence]) {
            formData[evidenceMap[selectedEvidence]] = "Yes";
        } else {
            formData["Utility bill"] = "No"; // Default to "No"
        }
    };

    const categoriseDwellingType = () => {
        const selectedProperty = getVal('propertyType');   
        const houseTypes = ['Semi-Detached House', 'Detached House', 'End-Terrace House', 'Mid-Terrace House', 'Bungalow'];
        const flatTypes = ['Top Floor Flat', 'Mid Floor Flat', 'Ground Floor Flat', 'Top Floor Maisonette', 'Mid Floor Maisonette', 'Ground Floor Maisonette', 'Studio Flat'];
        const parkHomeTypes = ['Park Home'];

        if (houseTypes.includes(selectedProperty)) {
            formData["Dwelling type"] = "House";
        } else if (flatTypes.includes(selectedProperty)) {
            formData["Dwelling type"] = "Flat";
        } else if (parkHomeTypes.includes(selectedProperty)) {
            formData["Dwelling type"] = "Park Home";
        } else {
            formData["Dwelling type"] = ""; // Default value if none matches
        }
    };

    return {
        populateFormData,
        getFormData: () => formData,
    };
    
})();

function createXFDF(data) {
    let xfdfContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xfdfContent += '<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">\n';
    xfdfContent += '  <fields>\n';

    for (const [key, value] of Object.entries(data)) {
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
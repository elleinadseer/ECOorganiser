
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

function populateFormData() {
    return {
        "Customer Name": `${document.getElementById('fName').value.trim()} ${document.getElementById('mName').value.trim()} ${document.getElementById('sName').value.trim()}`,
        "Customer Phone": document.getElementById('tel').value.trim(),
        "Customer Address": `${document.getElementById('street').value.trim()}, ${document.getElementById('town').value.trim()}`,
        "Customer Postcode": document.getElementById('postcode').value.trim(),
        /* "HTHG Job": document.getElementById('HTHG').checked,
        "DWP Data Matched": document.getElementById('DWPmatch').checked,
        "Benefit Letter Job": document.getElementById('flex').checked,
        "LA Flex Job": document.getElementById('flex').checked, */
        "URN": document.getElementById('URN').value.trim(),
        "DataMatchDate": document.getElementById('installDateInput').value.trim(),
        "Tenure type": document.getElementById('tenancySelect').value.trim(),
        "Landlord": document.getElementById('landlord').value.trim(),
        "Scheme": document.getElementById('schemeSelect').value.trim(),
        "Survey Date": document.getElementById('surveyDate').value.trim(),
        "Survey Lodgement Date": document.getElementById('submissionDate').value.trim(),
        "Dwelling type": document.getElementById('propertyType').value.trim(),
        "Total Floor Area m2": document.getElementById('totalFloorArea').value.trim(),
        "SAP Rating": document.getElementById('SAPrating').value.trim(),
        "Reference number": document.getElementById('rdsapNum').value.trim(),
        "Wall Age": document.getElementById('YOpropSelect').value.trim(),
        "PAS Measure 1": document.getElementById('m1measureList').value.trim(),
        "PAS Measure 1 Material Dropdown": document.getElementById('m1material').value.trim(),
        "PAS Measure 1 Material Text": document.getElementById('m1material').value.trim(),
        "PAS Measure 1 Install Company": document.getElementById('m1installerCompany').value.trim(),
        "PAS Measure 1 Cert Body": document.getElementById('m1installerName').value.trim(),
        "PAS Measure 1 Installer": document.getElementById('m1installerName').value.trim(),
        "PAS Measure 1 Cert": document.getElementById('m1PAScertNum').value.trim(),
        // "PAS Measure 1 Cert Checkbox": document.getElementById('m1PAScertNum').checked
    };
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
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
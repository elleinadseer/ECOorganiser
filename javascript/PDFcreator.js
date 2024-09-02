document.addEventListener('DOMContentLoaded', () => {
    const frontSheetRequestor = document.getElementById('frontSheetRequestor');
    const smartPackRequestor = document.getElementById('smartPackRequestor'); // Assuming another button or trigger for the other PDF

    // Utility function to safely set text if the field exists
    function setTextIfFieldExists(form, fieldName, value) {
        const field = form.getTextField(fieldName);
        if (field) {
            field.setText(value);
        }
    }

    // Function to gather form data
    function gatherFormData() {
        return {
            // Front Sheet Variables
            propAddress: document.getElementById('street').value + ', ' +
                         document.getElementById('town').value + ', ' +
                         document.getElementById('postcode').value,
            names: document.getElementById('fName').value + ' ' +
                   document.getElementById('sName').value,
            phoneNum: document.getElementById('tel').value,
            tenancy: document.querySelector('select').value, // Assuming there's only one select for tenancy
            landlord: document.getElementById('landlord').value,
            surveyDate: document.getElementById('surveyDate').value,
            submissionDate: document.getElementById('submissionDate').value,
            installDate: document.getElementById('installDateInput').value,
            TFL: document.getElementById('totalFloorArea').value,
            SAPrating: document.getElementById('SAPrating').value,

            m1: document.getElementById('m1measureList').value,
            m1installer: document.getElementById('m1installerName').value,
            m2: document.getElementById('m2measureList').value,
            m2installer: document.getElementById('m2installerName').value,
            m3: document.getElementById('m3measureList').value,
            m3installer: document.getElementById('m3installerName').value,
            m4: document.getElementById('m4measureList').value,
            m4installer: document.getElementById('m4installerName').value,
            m5: document.getElementById('m5measureList').value,
            m5installer: document.getElementById('m5installerName').value,
        };
    }

    // Function to fill the 'Blank Front Sheet' PDF
    async function fillBlankFrontSheetPdf(form, data) {
        // Fill fields specific to 'Blank Front Sheet'
        setTextIfFieldExists(form, 'PROPERTY ADDRESS', data.propAddress);
        setTextIfFieldExists(form, 'NAME SURNAME', data.names);
        setTextIfFieldExists(form, 'PHONE NUMBER', data.phoneNum);
        setTextIfFieldExists(form, 'TENANCY', data.tenancy);
        setTextIfFieldExists(form, 'LANDLORD', data.landlord);
        setTextIfFieldExists(form, 'RETROFIT ASSESSOR', "Harley Thorne");
        setTextIfFieldExists(form, 'SURVEY DATE', data.surveyDate);
        setTextIfFieldExists(form, 'SURVEY LODGMENT DATE', data.submissionDate);
        setTextIfFieldExists(form, 'DESIGN DATE', data.submissionDate);
        setTextIfFieldExists(form, 'VENTILATION DATE', data.installDate);
        setTextIfFieldExists(form, 'HANDOVER DATE', data.installDate);
        setTextIfFieldExists(form, 'TOTAL FLOOR AREA', data.TFL);
        setTextIfFieldExists(form, 'SAP RATING', "E" + data.SAPrating);

        setTextIfFieldExists(form, 'MEASURE 1', data.m1);
        setTextIfFieldExists(form, 'INSTALLER', data.m1installer);
        if (data.m1 && data.m1installer) {
            setTextIfFieldExists(form, 'INSTALL DATE', data.installDate);
        } else {
            setTextIfFieldExists(form, 'INSTALL DATE', '');
        }
        setTextIfFieldExists(form, 'MEASURE 2', data.m2);
        setTextIfFieldExists(form, 'INSTALLER_2', data.m2installer);
        if (data.m2 && data.m2installer) {
            setTextIfFieldExists(form, 'INSTALL DATE_2', data.installDate);
        } else {
            setTextIfFieldExists(form, 'INSTALL DATE_2', '');
        }        
        setTextIfFieldExists(form, 'MEASURE 3', data.m3);
        setTextIfFieldExists(form, 'INSTALLER_3', data.m3installer);
        if (data.m3 && data.m3installer) {
            setTextIfFieldExists(form, 'INSTALL DATE_3', data.installDate);
        } else {
            setTextIfFieldExists(form, 'INSTALL DATE_3', '');
        }   
        setTextIfFieldExists(form, 'MEASURE 4', data.m4);
        setTextIfFieldExists(form, 'INSTALLER_4', data.m4installer);
        if (data.m4 && data.m4installer) {
            setTextIfFieldExists(form, 'INSTALL DATE_4', data.installDate);
        } else {
            setTextIfFieldExists(form, 'INSTALL DATE_4', '');
        }   
        setTextIfFieldExists(form, 'MEASURE 5', data.m5);
        setTextIfFieldExists(form, 'INSTALLER_5', data.m5installer);
        if (data.m5 && data.m5installer) {
            setTextIfFieldExists(form, 'INSTALL DATE_5', data.installDate);
        } else {
            setTextIfFieldExists(form, 'INSTALL DATE_5', '');
        }
    }

    // Function to fill another PDF (for example 'Other Sheet')
    async function fillSmartPack(form, data) {
        // Fill fields specific to 'Other Sheet'
        setTextIfFieldExists(form, 'Customer Name', data.names);
        // Add more fields as needed...
    }

    // General function to load and fill a PDF
    async function fillPdfForm(pdfFileName, fillPdfFunction) {
        const data = gatherFormData(); // Gather the data once
        const existingPdfBytes = await fetch(`./${pdfFileName}.pdf`).then(res => res.arrayBuffer());
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        // Call the specific function to fill the form based on the PDF type
        await fillPdfFunction(form, data);

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdfFileName}.pdf`; // Adjust filename as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url); // Clean up the Object URL
    }

    // Attach the event listener to the div for 'Blank Front Sheet'
    frontSheetRequestor.addEventListener('click', () => fillPdfForm('BlankFrontSheet', fillBlankFrontSheetPdf));

    // Attach another event listener for a different PDF, if needed
    smartPackRequestor.addEventListener('click', () => fillPdfForm('BlankSmartPack', fillSmartPack));
});

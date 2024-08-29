document.addEventListener('DOMContentLoaded', () => {
    const frontSheetRequestor = document.getElementById('frontSheetRequestor');

    // Function to fill the PDF form
    async function fillPdfForm() {
        // Load an existing PDF
        const existingPdfBytes = await fetch('./Blank Front Sheet.pdf').then(res => res.arrayBuffer());

        // Load the PDF document
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

        // Get the form in the PDF
        const form = pdfDoc.getForm();

        // Get values from HTML form elements
        const propAddress = document.getElementById('street').value + ', ' +
                            document.getElementById('town').value + ', ' +
                            document.getElementById('postcode').value;
        const names = document.getElementById('fName').value + ' ' +
                //    document.getElementById('mName').value + ' ' +
                      document.getElementById('sName').value;
        const phoneNum = document.getElementById('tel').value;
        const tenancy = document.querySelector('select').value; // Assuming there's only one select for tenancy
        const landlord = document.getElementById('landlord').value;
        const surveyDate = document.getElementById('surveyDate').value;
        const submissionDate = document.getElementById('submissionDate').value;
        const installDate = document.getElementById('installDateInput').value;
        const TFL = document.getElementById('totalFloorArea').value;
        const SAPrating = document.getElementById('SAPrating').value;

        const m1 = document.getElementById('m1measureList').value;
        const m1installer = document.getElementById('m1installerName').value;
        const m2 = document.getElementById('m2measureList').value;
        const m2installer = document.getElementById('m2installerName').value;
        const m3 = document.getElementById('m3measureList').value;
        const m3installer = document.getElementById('m3installerName').value;
        const m4 = document.getElementById('m4measureList').value;
        const m4installer = document.getElementById('m4installerName').value;
        const m5 = document.getElementById('m5measureList').value;
        const m5installer = document.getElementById('m5installerName').value;

        // Fill the PDF form fields with data
        form.getTextField('PROPERTY ADDRESS').setText(propAddress);
        form.getTextField('NAME SURNAME').setText(names);
        form.getTextField('PHONE NUMBER').setText(phoneNum);
        form.getTextField('TENANCY').setText(tenancy);
        form.getTextField('LANDLORD').setText(landlord);
        form.getTextField('RETROFIT ASSESSOR').setText("Harley Thorne");
        form.getTextField('SURVEY DATE').setText(surveyDate);
        form.getTextField('SURVEY LODGMENT DATE').setText(submissionDate);
        form.getTextField('DESIGN DATE').setText(submissionDate);
        form.getTextField('VENTILATION DATE').setText(installDate);
        form.getTextField('HANDOVER DATE').setText(installDate);
        form.getTextField('TOTAL FLOOR AREA').setText(TFL);
        form.getTextField('SAP RATING').setText("E"+ SAPrating);

        form.getTextField('MEASURE 1').setText(m1);
        form.getTextField('INSTALLER').setText(m1installer);
        if (m1 && m1installer) {
            form.getTextField('INSTALL DATE').setText(installDate);
        } else {
            form.getTextField('INSTALL DATE').setText('');
        }
        form.getTextField('MEASURE 2').setText(m2);
        form.getTextField('INSTALLER_2').setText(m2installer);
        if (m2 && m2installer) {
            form.getTextField('INSTALL DATE_2').setText(installDate);
        } else {
            form.getTextField('INSTALL DATE_2').setText('');
        }        
        form.getTextField('MEASURE 3').setText(m3);
        form.getTextField('INSTALLER_3').setText(m3installer);
        form.getTextField('INSTALL DATE_3').setText( );
        form.getTextField('MEASURE 4').setText(m4);
        form.getTextField('INSTALLER_4').setText(m4installer);
        form.getTextField('INSTALL DATE_4').setText( );
        form.getTextField('MEASURE 5').setText(m5);
        form.getTextField('INSTALLER_5').setText(m5installer);
        if (m5 && m5installer) {
            form.getTextField('INSTALL DATE_5').setText(installDate);
        } else {
            form.getTextField('INSTALL DATE_5').setText('');
        }

        // Optionally, handle other fields similarly...

        form.flatten(); // Flatten the form fields

        // Serialize the PDF to bytes (Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // In the browser, you can download the PDF like this
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${propAddress} Front Sheet.pdf`;
        document.body.appendChild(a); // Append the anchor to the document body
        a.click();
        document.body.removeChild(a); // Clean up the DOM after the download
      
        // Optionally revoke the Object URL to free up memory
        URL.revokeObjectURL(url);
    }

    // Attach the event listener to the div
    frontSheetRequestor.addEventListener('click', fillPdfForm);
});


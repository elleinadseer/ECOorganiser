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

        // Get the fields in the form by name
        const propAddress = form.getTextField('PROPERTY ADDRESS');
        const names = form.getTextField('NAME SURNAME');
        const phoneNum = form.getTextField('PHONE NUMBER');
        const tenancy = form.getTextField('TENANCY');
        const landlord = form.getTextField('LANDLORD');
        const surveyDate = form.getTextField('SURVEY DATE');
        const submissionDate = form.getTextField('SURVEY LODGMENT DATE');
        const designDate = form.getTextField('DESIGN DATE');

        const m1 = form.getTextField('MEASURE 1'); const m2 = form.getTextField('MEASURE 2'); const m3 = form.getTextField('MEASURE 3'); const m4 = form.getTextField('MEASURE 4'); const m5 = form.getTextField('MEASURE 5');
        const in1 = form.getTextField('INSTALLER'); const in2 = form.getTextField('INSTALLER_2'); const in3 = form.getTextField('INSTALLER_3'); const in4 = form.getTextField('INSTALLER_4'); const in5 = form.getTextField('INSTALLER_5');
        const inda1 = form.getTextField('INSTALL DATE'); const inda2 = form.getTextField('INSTALL DATE_2'); const inda3 = form.getTextField('INSTALL DATE_3'); const inda4 = form.getTextField('INSTALL DATE_4'); const inda5 = form.getTextField('INSTALL DATE_5');

        const installDate = form.getTextField('VENTILATION DATE');
        const handoverDate = form.getTextField('HANDOVER DATE');
        const TFL = form.getTextField('TOTAL FLOOR AREA');
        const SAPrating = form.getTextField('SAP RATING');

        // Fill the form fields with data
        propAddress.setText('134 Bleak Road');
        names.setText('Danielle Rees');
        phoneNum.setText('1243354544');
        tenancy.setText('Tenant');
        landlord.setText('Stevie Rees');
        surveyDate.setText('12/08/2024');
        submissionDate.setText('15/08/2024');
        designDate.setText('17/08/2024');
        m1.setText('TTZC');
        in1.setText('Jatinder Malhi');
        inda1.setText('19/08/2024');
        installDate.setText('21/08/2024');
        handoverDate.setText('23/08/2024');
        TFL.setText('54');
        SAPrating.setText('E34');

        // Serialize the PDF to bytes (Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // In the browser, you can download the PDF like this
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filled_form.pdf';
        document.body.appendChild(a); // Append the anchor to the document body
        a.click();
        document.body.removeChild(a); // Clean up the DOM after the download
      
        // Optionally revoke the Object URL to free up memory
        URL.revokeObjectURL(url);
    }

    // Attach the event listener to the div
    frontSheetRequestor.addEventListener('click', fillPdfForm);
});

// Load PDF-LIB library (if using a CDN, this line is not needed)
const { PDFDocument } = require('pdf-lib');

const frontSheetRequestor = document.getElementById('frontSheetRequestor');

// Example function to fill the PDF form
async function fillPdfForm() {
  // Load an existing PDF
  const existingPdfBytes = await fetch('./Blank Front Sheet.pdf').then(res => res.arrayBuffer());

  // Load the PDF document
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the form in the PDF
  const form = pdfDoc.getForm();

  // Get the fields in the form by name
  const propAddress = form.getTextField('PROPERTY ADDRESS');
  const names = form.getTextField('NAME SURNAME');
  const phoneNum = form.getRadioGroup('PHONE NUMBER');
  const tenancy = form.getTextField('TENANCY');
  const landlord = form.getTextField('LANDLORD');
  const surveyDate = form.getTextField('SURVEY DATE');
  const submissionDate = form.getTextField('SURVEY LODGMENT DATE');
  const designDate = form.getTextField('DESIGN DATE');

  const m1 = form.getTextField('MEASURE 1'); const m2 = form.getTextField('MEASURE 2'); const m3 = form.getTextField('MEASURE 3'); const m4 = form.getTextField('MEASURE 4'); const m5 = form.getTextField('MEASURE 5');
  const in1 = form.getTextField('INSTALLER'); const in2 = form.getTextField('INSTALLER_2'); const in3 = form.getTextField('INSTALLER_3'); const in4 = form.getTextField('INSTALLER_4'); const in5 = form.getTextField('INSTALLER_5');
  const inda1 = form.getTextField('INSTALLER DATE'); const inda2 = form.getTextField('INSTALLER DATE_2'); const inda3 = form.getTextField('INSTALLER DATE_3'); const inda4 = form.getTextField('INSTALLER DATE_4'); const inda5 = form.getTextField('INSTALLER DATE_5');

  const installDate = form.getTextField('VENTILATION DATE');
  const handoverDate = form.getTextField('HANDOVER DATE');
  const EPRnums = form.getTextField('EPR JUMPS');

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
  EPRnums.setText('54 <br> E35');

  /* If the PDF has a checkbox or similar fields, you can manipulate them as well
  const agreeField = form.getCheckBox('AgreeToTerms');
  agreeField.check(); // Or agreeField.uncheck();

  // Flatten the form so the fields become uneditable (optional)
  form.flatten(); */

  // Serialize the PDF to bytes (Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Save the filled PDF (in Node.js)
  const fs = require('fs');
  fs.writeFileSync('filled_form.pdf', pdfBytes);

  // In the browser, you can download the PDF like this
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'filled_form.pdf';
  a.click();
}

// Call the function to fill the PDF
fillPdfForm();

frontSheetRequestor.addEventListener('click', fillPdfForm);

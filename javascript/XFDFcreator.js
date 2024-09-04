const xmlbuilder = require('xmlbuilder');

const smartPackRequestor = document.getElementById('smartPackRequestor'); // Assuming another button or trigger for the other PDF

function populateFormData() {
    return {
        "Customer Name": `${document.getElementById('fName').value.trim()} ${document.getElementById('mName').value.trim()} ${document.getElementById('sName').value.trim()}`,
        "Customer Phone": document.getElementById('tel').value.trim(),
    };
}

function createXFDF(formData) {
    const xfdf = xmlbuilder.create('xfdf', { encoding: 'UTF-8' })
        .att('xmlns', 'http://ns.adobe.com/xfdf/')
        .att('xml:space', 'preserve')
        .ele('fields');

    Object.keys(formData).forEach((key) => {
        xfdf.ele('field', { name: key }).ele('value', formData[key]);
    });

    return xfdf.end({ pretty: true });
}

smartPackRequestor.addEventListener('click',  function(event) {
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

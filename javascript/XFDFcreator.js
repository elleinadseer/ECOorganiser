/* Code to handcraft file */

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

/* code to generate server side 

CLIENT.JS:
document.addEventListener('DOMContentLoaded', (event) => {
    const smartPackRequestor = document.getElementById('smartPackRequestor');

    if (smartPackRequestor) {
        smartPackRequestor.addEventListener('click', function(event) {
            console.log('Button clicked');
            event.preventDefault();
            const formData = populateFormData();
            fetch('/create-xfdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'formdata.xfdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
        });
    } else {
        console.error('Button element not found');
    }
});

function populateFormData() {
    return {
        "Customer Name": `${document.getElementById('fName').value.trim()} ${document.getElementById('mName').value.trim()} ${document.getElementById('sName').value.trim()}`,
        "Customer Phone": document.getElementById('tel').value.trim(),
    };
}

SERVER.JS:
const express = require('express');
const { create } = require('xmlbuilder2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/create-xfdf', (req, res) => {
    const formData = req.body;

    const xfdfContent = createXFDF(formData);
    res.setHeader('Content-Disposition', 'attachment; filename=formdata.xfdf');
    res.setHeader('Content-Type', 'application/vnd.adobe.xfdf');
    res.send(xfdfContent);
});

function createXFDF(formData) {
    // Use xmlbuilder2 directly in the server environment
    const xfdf = create('xfdf', { encoding: 'UTF-8' })
        .att('xmlns', 'http://ns.adobe.com/xfdf/')
        .att('xml:space', 'preserve')
        .ele('fields');

    Object.keys(formData).forEach((key) => {
        xfdf.ele('field', { name: key }).ele('value', formData[key]);
    });

    return xfdf.end({ pretty: true });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

*/ 
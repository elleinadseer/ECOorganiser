document.getElementById('uploadPdf').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function() {
        var typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    var text = textContent.items.map(function(item) {
                        return item.str;
                    }).join(' ');

                    // Example of parsing text to find specific data (e.g., name and email)
                    var name = extractName(text);
                    var email = extractEmail(text);

                    // Fill the form fields
                    document.getElementById('name').value = name;
                    document.getElementById('email').value = email;
                });
            });
        });
    };

    fileReader.readAsArrayBuffer(file);
});

function extractName(text) {
    // Regular expression to find a name after "Full Name:", "Name:", etc.
    const namePattern = /(?:Full Name|Name):\s*([A-Za-z\s]+)/i;

    // Match the pattern in the text
    const match = text.match(namePattern);

    // If a match is found, return the captured group (the name)
    if (match && match[1]) {
        return match[1].trim(); // Trim any extra whitespace
    }

    // If no match is found, return a default or empty string
    return "";
}

function extractEmail(text) {
    // Example: A more general pattern for names (First Last) or (First Middle Last)
    const namePattern = /(?:Full Name|Name):\s*([A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/;

    const match = text.match(namePattern);

    if (match && match[1]) {
        return match[1].trim();
    }

    return "";
}



document.getElementById('myForm').submit();

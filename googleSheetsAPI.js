function initClient() {
    gapi.client.init({
        'apiKey': 'YOUR_API_KEY',
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(function() {
        // Load your sheet data
        loadSheetData();
    });
}

function loadSheetData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Sheet1!A1:D10', // Adjust the range as needed
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                console.log(row);
                // Example: Fill a form field with data from the first cell
                document.getElementById('name').value = row[0];
            }
        } else {
            console.log('No data found.');
        }
    }, function(response) {
        console.log('Error: ' + response.result.error.message);
    });
}

gapi.load('client', initClient);

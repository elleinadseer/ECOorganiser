// googleSheetsAPI.js 

/*
function initClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyA7Vr3TWalHb1wZgam4CEgjC_E1qzPtGWQ',
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(function() {
        // Initialization successful
    });
}

function searchPostcode(postcode) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1b9Vrvtd4Hbg4R9DPg1UrH5cdTkYtLp90uOb5ChztPKo',
        range: 'Sheet1!A1:M1967'
    }).then(function(response) {
        const rows = response.result.values;
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row[9] === postcode) { 
                    return {
                        surname: row[0],    // Column A
                        forename: row[1],   // Column B
                        urn: row[10]        // Column K
                    };
                }
            }
        }
        throw new Error('Postcode not found.');
    });
}

// Load the Google API client library and initialize
gapi.load('client', initClient);
*/
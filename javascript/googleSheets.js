import { capitaliseFirstLetter } from './helpers.js'; // Import the function

// Function to initialize Google Sheets API client
export function initClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyA7Vr3TWalHb1wZgam4CEgjC_E1qzPtGWQ',
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(function() {
        console.log('Google Sheets API initialized.');
    }, function(error) {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Function to load sheet data and search for a postcode and address number
export function searchPostcode(postcode, addressNumber) {
    if (!gapi.client || !gapi.client.sheets) {
        console.error('Google Sheets API client is not initialized.');
        return Promise.reject('Google Sheets API client is not initialized.');
    }

    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1b9Vrvtd4Hbg4R9DPg1UrH5cdTkYtLp90uOb5ChztPKo',
        range: 'DWP+OFGEM!A1:K', // Adjusted range
    }).then(function(response) {
        var rows = response.result.values;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row[9] === postcode && row[3] === addressNumber) { // Column J (index 9) for postcode and Column D (index 3) for address number
                    // Extract and capitalize first letters of surname and forename
                    var surname = capitaliseFirstLetter(row[0]);
                    var forename = capitaliseFirstLetter(row[1]);
                    var urn = row[10]; // Column K

                    return {
                        surname: surname,
                        forename: forename,
                        urn: urn
                    };
                }
            }
            throw new Error('Postcode and address number combination not found.');
        } else {
            throw new Error('No data found.');
        }
    }).catch(function(error) {
        console.error('Error searching postcode:', error);
        throw error;
    });
}
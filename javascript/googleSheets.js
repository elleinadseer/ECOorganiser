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

    // First, search in the original range for the postcode and address number
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1b9Vrvtd4Hbg4R9DPg1UrH5cdTkYtLp90uOb5ChztPKo',
        range: 'DWP+OFGEM!A1:K', // Original range
    }).then(function(response) {
        var rows = response.result.values;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row[9] === postcode && row[3] === addressNumber) {
                    // Extract and capitalize first letters of surname and forename
                    var surname = capitaliseFirstLetter(row[0]);
                    var forename = capitaliseFirstLetter(row[1]);
                    var urn = row[10]; // Column K

                    // SUBMISSION TAB SEARCH
                    return gapi.client.sheets.spreadsheets.values.get({
                        spreadsheetId: '1b9Vrvtd4Hbg4R9DPg1UrH5cdTkYtLp90uOb5ChztPKo',
                        range: 'SUBMISSION!B1:G' 
                    }).then(function(submissionResponse) {
                        var submissionRows = submissionResponse.result.values;
                        if (submissionRows.length > 0) {
                            for (var j = 0; j < submissionRows.length; j++) {
                                var submissionRow = submissionRows[j];
                                if (submissionRow[0] === postcode) { // Column B for postcode
                                    var text = submissionRow[1]; // Column B text
                                    
                                    // Extract the scheme (text inside brackets) and measures (text outside brackets)
                                    var schemeMatches = text.match(/\(([^)]+)\)/g) || [];
                                    var schemes = schemeMatches.map(match => match.slice(1, -1)); // Remove brackets
                                    
                                    var measures = text
                                        .replace(/\([^)]*\)/g, '') // Remove text within brackets
                                        .replace(/[\+\-/]/g, '') // Remove special characters
                                        .split(/\s+/) // Split by whitespace
                                        .filter(word => /^[a-zA-Z]+$/.test(word)); // Keep only text

                                    // Retrieve date from column G and eligibility from column F
                                    var date = submissionRow[5]; // Column G
                                    var eligibility = submissionRow[4]; // Column F

                                    return {
                                        surname: surname,
                                        forename: forename,
                                        urn: urn,
                                        schemes: schemes,
                                        measures: measures,
                                        date: date,
                                        eligibility: eligibility
                                    };
                                }
                            }
                            throw new Error('Postcode not found in SUBMISSION range.');
                        } else {
                            throw new Error('No data found in SUBMISSION range.');
                        }
                    }).catch(function(submissionError) {
                        console.error('Error searching in SUBMISSION range:', submissionError);
                        throw submissionError;
                    });
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

// Google Sheets API initialization
function initClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyA7Vr3TWalHb1wZgam4CEgjC_E1qzPtGWQ',
        'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(function() {
        console.log('Google Sheets API initialized.');
    }, function(error) {
        console.error('Error initializing Google Sheets API:', error);
    });
}

// Helper function to capitalize the first letter of a string
function capitaliseFirstLetter(str) {
    return str.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

// Function to load sheet data and search for a postcode
function searchPostcode(postcode) {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1b9Vrvtd4Hbg4R9DPg1UrH5cdTkYtLp90uOb5ChztPKo',
        range: 'DWP+OFGEM!A1:K', // Adjusted range
    }).then(function(response) {
        var rows = response.result.values;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row[9] === postcode) { // Column J (index 9)
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
            throw new Error('Postcode not found.');
        } else {
            throw new Error('No data found.');
        }
    }).catch(function(error) {
        console.error('Error searching postcode:', error);
        throw error;
    });
}

// Helper function to extract data using regex
function extractData(pattern, text) {
    var match = text.match(pattern);
    return match ? match[1].trim() : null;
}

// Helper function to convert date format from dd/mm/yyyy to yyyy-mm-dd
function convertDateFormat(dateStr) {
    var parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Helper function to select a dropdown option based on extracted text
function selectDropdownOption(dropdownSelector, extractedValue) {
    var selectElement = document.querySelector(dropdownSelector);
    var options = selectElement.options;

    for (var i = 0; i < options.length; i++) {
        if (options[i].text === extractedValue) {
            options[i].selected = true;
            break;
        }
    }
}

// Function to handle PDF extraction and form filling
function handlePdfExtraction() {
    document.getElementById('uploadPdf').addEventListener('change', function(e) {
        var file = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);

            pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                var allTextPromises = [];

                // Loop through all the pages and get the text content
                for (var i = 1; i <= pdf.numPages; i++) {
                    allTextPromises.push(pdf.getPage(i).then(function(page) {
                        return page.getTextContent().then(function(textContent) {
                            return textContent.items.map(function(item) {
                                return item.str;
                            }).join(' ');
                        });
                    }));
                }

                // When all text contents are resolved, process the aggregated text
                Promise.all(allTextPromises).then(function(pagesText) {
                    var text = pagesText.join(' ');

                    console.log("Extracted Text:", text);

                    // Extract the data using regex
                    var extractedData = {
                        assessment_date: extractData(/Assessment Date\s+(\d{2}\/\d{2}\/\d{4})/, text),
                        submission_date: extractData(/Submission Date\s+(\d{2}\/\d{2}\/\d{4})/, text),
                        total_floor_area: extractData(/Total Floor Area\s+(\d+)/, text),
                        current_efficiency_rating: extractData(/G G\s*\(1-20\)\s+(\d+)/, text),
                        reference_number: extractData(/Reference\s+(\d+)/, text),
                        construction_year: extractData(/built in\s+[A-Z]\s+(\d{4}-\d{4})/, text),
                        property_type: extractData(/Property Type\s+(.+?)\s+Total Floor Area/, text),
                        wall_type: extractData(/Wall Type:\s+(.+?)\s+Wall Insulation/, text),
                        roof_type: extractData(/Roof Type:\s+(.+?),/, text),
                    };

                    console.log("Extracted Data:", extractedData);

                    // Extract the address using regex
                    var addressMatch = text.match(/Dwelling Address\s+(\d+),\s+([\w\s]+),\s+([A-Z]+),\s+([A-Z\d]{2,4}\s\d[A-Z]{2})/);
                    if (addressMatch) {
                        var street = `${addressMatch[1]} ${addressMatch[2].trim()}`;
                        var town = capitaliseFirstLetter(addressMatch[3].trim());
                        var postcode = addressMatch[4].trim();

                        // Fill in the address fields
                        document.getElementById('postcode').value = postcode;
                        document.getElementById('street').value = street;
                        document.getElementById('town').value = town;

                        console.log('Address match results:', {
                            postcode: document.getElementById('postcode').value,
                            street: document.getElementById('street').value,
                            town: document.getElementById('town').value
                        });                   

                        // Search for postcode and fill form
                    searchPostcode(postcode).then(function(record) {
                        // Log the data retrieved from the searchPostcode function
                        console.log('Data retrieved from searchPostcode:', record);

                        document.getElementById('sName').value = record.surname || "";
                        document.getElementById('fName').value = record.forename || "";
                        document.getElementById('URN').value = record.urn || "";
                    }).catch(function(error) {
                        console.error('Error retrieving data from Google Sheets:', error);
                    });

                    // Additional data extraction
                    var match = text.match(/Lowest floor\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
                    if (match) {
                        var roofArea = match[1];
                        var roomHeight = match[2];
                        var wallPerimeter = match[3];

                        // Log the extracted values
                        console.log('Extracted values:', {
                            roofArea: roofArea,
                            roomHeight: roomHeight,
                            wallPerimeter: wallPerimeter
                        });

                        // Fill the form fields with the extracted values
                        document.getElementById('roofArea').value = roofArea || "";
                        document.getElementById('roomHeight').value = roomHeight || "";
                        document.getElementById('wallPerimeter').value = wallPerimeter || "";
                    } else {
                        console.log('No match found in the text.');
                    }}


                    // Fill the form fields with the extracted data
                    document.getElementById('surveyDate').value = convertDateFormat(extractedData.assessment_date) || "";
                    document.getElementById('submissionDate').value = convertDateFormat(extractedData.submission_date) || "";
                    document.getElementById('totalFloorArea').value = extractedData.total_floor_area || "";
                    document.getElementById('SAPrating').value = extractedData.current_efficiency_rating || "";
                    document.getElementById('rdsapNum').value = extractedData.reference_number || "";
                    document.getElementById('propType').value = extractedData.property_type || "";
                    document.getElementById('wallConstruct').value = extractedData.wall_type || "";
                    document.getElementById('roofTypes').value = extractedData.roof_type || "";

                    // Select the appropriate option in the dropdowns
                    selectDropdownOption('#YOpropSelect', extractedData.construction_year);
                    selectDropdownOption('#wallConstructSelect', extractedData.wall_type);

                    // Optionally submit the form
                    // document.getElementById('myForm').submit();
                });

            });
        };

        fileReader.readAsArrayBuffer(file);
    });
}

// Load Google API client and initialize PDF extraction
gapi.load('client', initClient);
handlePdfExtraction();



/* 
                        primary_heating_system: extractData(/Main Heating 1\s+PCDF boiler Reference\s+(.+?)\s+/, text),
                        current_co2_rating: extractData(/CO2\s*Emissions Rating.*?Current\s+(\d+)/, text),
                        potential_co2_rating: extractData(/CO2\s*Emissions Rating.*?Potential\s+(\d+)/, text),
                        estimated_energy_costs: extractData(/TOTAL\s+£(\d+)/, text),
                        estimated_energy_savings: extractData(/You could save £(\d+)/, text),

                    document.getElementById('potential_efficiency_rating').value = extractedData.potential_efficiency_rating || "";
                    document.getElementById('current_co2_rating').value = extractedData.current_co2_rating || "";
                    document.getElementById('potential_co2_rating').value = extractedData.potential_co2_rating || "";
                    document.getElementById('estimated_energy_costs').value = extractedData.estimated_energy_costs || "";
                    document.getElementById('estimated_energy_savings').value = extractedData.estimated_energy_savings || "";
                    document.getElementById('primary_heating_system').value = extractedData.primary_heating_system || "";
*/
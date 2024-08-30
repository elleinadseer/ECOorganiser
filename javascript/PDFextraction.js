import { populateInstallerInfo } from './measures.js';
import { initClient, searchPostcode, searchSubmission } from './googleSheets.js';
import { capitaliseFirstLetter, extractData, convertDateFormat, selectDropdownOption } from './helpers.js';

function showMeasureRow(measureIndex) {
    // Define the IDs of the elements to show
    const measureListDiv = document.getElementById(`m${measureIndex}measureListDiv`);
    const materialsDD = document.getElementById(`m${measureIndex}materialsDD`);
    const installerComps = document.getElementById(`m${measureIndex}installerComps`);
    const installerNameList = document.getElementById(`m${measureIndex}installerNameList`);
    const PAScert = document.getElementById(`m${measureIndex}PAScert`);
    const POPTs = document.getElementById(`m${measureIndex}POPTs`);

    // Array of elements to show
    const elementsToShow = [
        measureListDiv,
        materialsDD,
        installerComps,
        installerNameList,
        PAScert,
        POPTs
    ];

    // Iterate over each element and set its display property
    elementsToShow.forEach(element => {
        if (element) {
            element.style.display = 'block'; // Show the element
        }
    });
}


// Function to handle PDF extraction and form filling
export function handlePdfExtraction() {
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
                    var addressMatch = text.match(/Dwelling Address\s*(\d+),\s*([\w\s]+?),\s*([A-Z\s]+?),\s*([A-Z\d]{2,4}\s\d[A-Z]{2})/);
                    if (addressMatch) {
                        var street = `${addressMatch[1]} ${addressMatch[2].trim()}`;
                        var town = capitaliseFirstLetter(addressMatch[3].trim());
                        var postcode = addressMatch[4].trim();
                        var addressNumber = addressMatch[1].trim();

                        // Fill in the address fields
                        document.getElementById('postcode').value = postcode;
                        document.getElementById('street').value = street;
                        document.getElementById('town').value = town;

                        console.log('Address match results:', {
                            postcode: document.getElementById('postcode').value,
                            street: document.getElementById('street').value,
                            town: document.getElementById('town').value
                        });

                        searchSubmission(postcode).then(function(record) {
                            // Log the data retrieved from searchSubmission function
                            console.log('Data retrieved from searchSubmission:', record);
                        
                            // Assuming you have form fields with these IDs and you want to fill them
                            selectDropdownOption('#schemeSelect', record.scheme);
                            document.getElementById('installDateInput').value = record.installDate || "";
                        
                            // Iterate over the record.measures array and fill the corresponding dropdowns
                            record.measures.forEach(function(measure, index) {
                                // Determine the measure row index (1-based)
                                const measureIndex = index + 1;

                                // Show the respective measure row
                                showMeasureRow(measureIndex);

                                // Assuming measureList divs are named sequentially as m1measureList, m2measureList, etc.
                                var dropdownId = '#m' + measureIndex + 'measureList';
                                selectDropdownOption(dropdownId, measure);

                                // Populate installer info for each measure
                                populateInstallerInfo(measure, measureIndex);
                            });

                            document.getElementById('eligibility').value = record.eligibility || "";
                        
                            console.log('Record Install Date:', record.installDate); // Log to verify the date value
                        
                        }).catch(function(error) {
                            console.error('Error retrieving data from Google Sheets:', error);
                        });

                        // Search for postcode and address number, then fill form
                        searchPostcode(postcode, addressNumber).then(function(record) {
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
                            var floorArea = match[1];
                            var roomHeight = match[2];
                            var wallPerimeter = match[3];

                            // Log the extracted values
                            console.log('Extracted values:', {
                                floorArea: floorArea,
                                roomHeight: roomHeight,
                                wallPerimeter: wallPerimeter
                            });

                            // Fill the form fields with the extracted values
                            document.getElementById('floorArea').value = floorArea || "";
                            document.getElementById('roomHeight').value = roomHeight || "";
                            document.getElementById('wallPerimeter').value = wallPerimeter || "";
                        } else {
                            console.log('No match found in the text.');
                        }
                    }

                    // Fill the form fields with the extracted data
                    document.getElementById('surveyDate').value = extractedData.assessment_date || "";
                    document.getElementById('submissionDate').value = extractedData.submission_date || "";
                    document.getElementById('totalFloorArea').value = extractedData.total_floor_area || "";
                    document.getElementById('SAPrating').value = extractedData.current_efficiency_rating || "";
                    document.getElementById('rdsapNum').value = extractedData.reference_number || "";
                    document.getElementById('propType').value = extractedData.property_type || "";
                    document.getElementById('wallConstruct').value = extractedData.wall_type || "";
                    document.getElementById('roofTypes').value = extractedData.roof_type || "";

                    // Select the appropriate option in the dropdowns
                    selectDropdownOption('#YOpropSelect', extractedData.construction_year);
                    selectDropdownOption('#wallConstructSelect', extractedData.wall_type);
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
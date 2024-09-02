import { populateInstallerInfo } from './measures.js';
import { initClient, searchPostcode, searchSubmission } from './googleSheets.js';
import { capitaliseFirstLetter, extractData, selectDropdownOption } from './helpers.js';
import { showMeasureRow } from './appearenceChanges.js';

// Function to handle PDF extraction and form filling
export function handlePdfExtraction() {
    document.getElementById('uploadPdf').addEventListener('change', function(e) {

        var file = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);

            pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
                var allTextPromises = [];

                for (var i = 1; i <= pdf.numPages; i++) {
                    allTextPromises.push(pdf.getPage(i).then(function(page) {
                        return page.getTextContent().then(function(textContent) {
                            return textContent.items.map(function(item) {
                                return item.str;
                            }).join(' ');
                        });
                    }));
                }

                Promise.all(allTextPromises).then(function(pagesText) {
                    var text = pagesText.join(' ');

                    console.log("Extracted Text:", text);

                    var extractedData = {
                        assessment_date: extractData(/Assessment Date\s+(\d{2}\/\d{2}\/\d{4})/, text),
                        submission_date: extractData(/Submission Date\s+(\d{2}\/\d{2}\/\d{4})/, text),
                        total_floor_area: extractData(/Total Floor Area\s+(\d+)/, text),
                        current_efficiency_rating: extractData(/G G\s*\(1-20\)\s+(\d+)/, text),
                        reference_number: extractData(/Reference\s+(\d+)/, text),
                        construction_year: extractData(/built in\s+[A-Z]\s+(\d{4}-\d{4})/, text),
                        property_type: extractData(/Property Type\s+(.+?)\s+Total Floor Area/, text),
                        wall_type: extractData(/Wall Type:\s+[A-Z]{2}\s*(.+?)\s+Wall Insulation/, text),
                        roof_type: extractData(/Roof Type:\s+\w+\s+(\w+)/, text),
                    };

                    console.log("Extracted Data:", extractedData);

                    var addressMatch = text.match(/Dwelling Address\s*(\d+),\s*(.+?),\s*([A-Z\s]+?),\s*([A-Z\d]{2,4}\s\d[A-Z]{2})/);
                    if (addressMatch) {
                        var addressNumber = addressMatch[1].trim();
                        var street = `${addressNumber} ${addressMatch[2].trim()}`;
                        var town = capitaliseFirstLetter(addressMatch[3].trim());
                        var postcode = addressMatch[4].trim();

                        document.getElementById('postcode').value = postcode;
                        document.getElementById('street').value = street;
                        document.getElementById('town').value = town;

                        console.log('Address match results:', {
                            postcode: document.getElementById('postcode').value,
                            street: document.getElementById('street').value,
                            town: document.getElementById('town').value
                        });

                        searchSubmission(postcode).then(function(record) {
                            console.log('Data retrieved from searchSubmission:', record);
                            selectDropdownOption('#schemeSelect', record.scheme);
                            document.getElementById('installDateInput').value = record.installDate || "";

                            record.measures.forEach(function(measure, index) {
                                const measureIndex = index + 1;
                                showMeasureRow(measureIndex);
                                var dropdownId = '#m' + measureIndex + 'measureList';
                                selectDropdownOption(dropdownId, measure);
                                populateInstallerInfo(measure, measureIndex);
                            });

                            document.getElementById('eligibility').value = record.eligibility || "";
                            console.log('Record Install Date:', record.installDate);
                        }).catch(function(error) {
                            console.error('Error retrieving data from Google Sheets:', error);
                        });

                        searchPostcode(postcode, addressNumber).then(function(record) {
                            console.log('Data retrieved from searchPostcode:', record);
                            document.getElementById('sName').value = record.surname || "";
                            document.getElementById('fName').value = record.forename || "";
                            document.getElementById('URN').value = record.urn || "";
                        }).catch(function(error) {
                            console.error('Error retrieving data from Google Sheets:', error);
                        });

                        var match = text.match(/Lowest floor\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
                        if (match) {
                            var floorArea = match[1];
                            var roomHeight = match[2];
                            var wallPerimeter = match[3];

                            console.log('Extracted values:', {
                                floorArea: floorArea,
                                roomHeight: roomHeight,
                                wallPerimeter: wallPerimeter
                            });

                            document.getElementById('floorArea').value = floorArea || "";
                            document.getElementById('roomHeight').value = roomHeight || "";
                            document.getElementById('wallPerimeter').value = wallPerimeter || "";
                        } else {
                            console.log('No match found in the text.');
                        }
                    }

                    document.getElementById('surveyDate').value = extractedData.assessment_date || "";
                    document.getElementById('submissionDate').value = extractedData.submission_date || "";
                    document.getElementById('totalFloorArea').value = extractedData.total_floor_area || "";
                    document.getElementById('SAPrating').value = extractedData.current_efficiency_rating || "";
                    document.getElementById('rdsapNum').value = extractedData.reference_number || "";

                    selectDropdownOption('#roofType', extractedData.roof_type);
                    selectDropdownOption('#wallConstructSelect', extractedData.wall_type);
                    selectDropdownOption('#propertyType', extractedData.property_type);
                    selectDropdownOption('#YOpropSelect', extractedData.construction_year);
                    selectDropdownOption('#wallConstructSelect', extractedData.wall_type);
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
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
                    dwelling_address: extractData(/Dwelling Address\s+(.+?),\s+(.+?),\s+(.+?)\s+Reference/, text),

                    assessment_date: extractData(/Assessment Date\s+(\d{2}\/\d{2}\/\d{4})/, text),
                    submission_date: extractData(/Submission Date\s+(\d{2}\/\d{2}\/\d{4})/, text),

                    total_floor_area: extractData(/Total Floor Area\s+(\d+\s*m²)/, text),
                    current_efficiency_rating: extractData(/G G\s*\(1-20\)\s+(\d+)/, text),

                    reference_number: extractData(/Reference\s+(\d+)/, text),

                    construction_year: extractData(/Construction details:.*?- built in\s+(C \d{4}-\d{4})/, text),
                    property_type: extractData(/Property Type\s+(.+?)\s+Total Floor Area/, text),

                    wall_type: extractData(/Wall Type:\s+(.+?)\s+Wall Insulation/, text),
                    roof_type: extractData(/Roof Type:\s+(.+?),/, text),
                };

                console.log("Extracted Data:", extractedData);

                var match = text.match(/Lowest floor\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);

                if (match) {
                    var floorArea = match[1];
                    var roomHeight = match[2];
                    var wallPerimeter = match[3];

                    // Fill the form fields with the extracted values
                    document.getElementById('floorArea').value = floorArea || "";
                    document.getElementById('roomHeight').value = roomHeight || "";
                    document.getElementById('wallPerimeter').value = wallPerimeter || "";
                }

                // Fill the form fields with the extracted data
                /* document.getElementById('address').value = extractedData.dwelling_address || ""; */

                document.getElementById('surveyDate').value = extractedData.assessment_date || "";
                document.getElementById('submissionDate').value = extractedData.submission_date || "";

                document.getElementById('SAPrating').value = extractedData.current_efficiency_rating || "";

                document.getElementById('rdsapNum').value = extractedData.reference_number || "";

                document.getElementById('propType').value = extractedData.property_type || "";
                document.getElementById('YOprop').value = extractedData.construction_year || "";

                document.getElementById('wallConstruct').value = extractedData.wall_type || "";
                document.getElementById('roofTypes').value = extractedData.roof_type || "";

                // Optionally, submit the form automatically
                document.getElementById('myForm').submit();
            });

        });
    };

    fileReader.readAsArrayBuffer(file);
});

// Helper function to extract data using regex
function extractData(pattern, text) {
    var match = text.match(pattern);
    return match ? match[1].trim() : null;
}


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
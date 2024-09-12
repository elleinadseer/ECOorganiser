document.addEventListener('DOMContentLoaded', function() {
    // Declare variables to be in scope
    const ttzcDiv = document.getElementById('TTZCradRequest');
    const inputBox = document.getElementById('radNum'); // Replace with your input box ID

    // Function to check measure dropdowns and show/hide TTZCradRequest
    function checkMeasureDropdowns() {
        let showTTZC = false;

        // Loop over measure indexes
        for (let measureIndex = 1; measureIndex <= 5; measureIndex++) {
            const dropdownId = 'm' + measureIndex + 'measureList';
            const dropdownElement = document.getElementById(dropdownId);

            if (dropdownElement && dropdownElement.value === 'TTZC') {
                showTTZC = true;
                break;
            }
        }

        if (ttzcDiv) {
            ttzcDiv.style.display = showTTZC ? 'flex' : 'none';
        } else {
            console.log("Element with ID 'TTZCradRequest' not found.");
        }
    }

    // Function to handle input box change
    function handleInputChange() {
        if (inputBox && ttzcDiv) {
            ttzcDiv.style.color = inputBox.value.trim() ? 'black' : 'red';
        } else {
            console.log("Input box or target div not found.");
        }
    }

    // Add event listener to the document for dropdown changes
    document.addEventListener('change', function(event) {
        // Check if the changed element is a measure dropdown
        if (event.target.id.startsWith('m') && event.target.id.endsWith('measureList')) {
            checkMeasureDropdowns();
        }
    });

    // Initial check on page load
    checkMeasureDropdowns();

    // Add event listener to the input box
    if (inputBox) {
        inputBox.addEventListener('input', handleInputChange);
    } else {
        console.log("Input box with ID 'radNum' not found.");
    }
});




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('schemeSelect').addEventListener('change', function() {

        var URNbox = document.getElementById('URNdisplay');
        var flexBox = document.getElementById('flexDisplay');
        var taxBandDisplay = document.getElementById('taxBandDisplay'); // Assuming this element exists

        if (this.value === 'Flex') {
            URNbox.style.display = 'none';   // Hide URNbox
            flexBox.style.display = 'block'; // Show flexBox
            taxBandDisplay.style.display = 'none';  // Hide taxBandDisplay
        } else if (this.value === 'General Eligibility') {
            URNbox.style.display = 'block';  // Show URNbox
            flexBox.style.display = 'none';  // Hide flexBox
            taxBandDisplay.style.display = 'flex';  // Show taxBandDisplay
        } else {
            URNbox.style.display = 'block';  // Show URNbox
            flexBox.style.display = 'none';  // Hide flexBox
            taxBandDisplay.style.display = 'none';  // Hide taxBandDisplay
        }

    });
});

document.getElementById('tenancySelect').addEventListener('change', function() {
    var landlordDiv = document.getElementById('landlordDiv');
    if (this.value === 'Private Tenant') {
        landlordDiv.style.display = 'block'; // Show landlordDiv
    } else {
        landlordDiv.style.display = 'none';  // Hide landlordDiv
    }
});

// MEASURE FUNCTIONS // 

export function showMeasureRow(measureIndex) {
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

let measureCount = 1;  // Initialize measure counter

// Function to add and show a new measure row
export function addMeasureRow() {
    measureCount++;  // Increment the measure counter

    // Call the existing function to show the measure row
    showMeasureRow(measureCount);

    if (measureCount >= 5) {
        const addMeasureBtn = document.getElementById("measureAdd");
        if (addMeasureBtn) {
            addMeasureBtn.style.display = 'none';  // Hide the button
        }
    }
}

// Event listener for "Add another measure"
export function setupMeasureAddButton() {
    const addMeasureBtn = document.getElementById("measureAdd");

    if (addMeasureBtn) {
        addMeasureBtn.addEventListener("click", () => {
            addMeasureRow();  // Add a new measure row when clicked
        });
    }
}

// Call this function to set up the listener on page load or when needed
setupMeasureAddButton();


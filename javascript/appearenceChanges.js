document.getElementById('tenancySelect').addEventListener('change', function() {
    var landlordDiv = document.getElementById('landlordDiv');
    if (this.value === 'Private Tenant') {
        landlordDiv.style.display = 'block'; // Show landlordDiv
    } else {
        landlordDiv.style.display = 'none';  // Hide landlordDiv
    }
});

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
export function capitaliseFirstLetter(str) {
    return str
        .toLowerCase()                   // Convert the whole string to lowercase
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize the first letter of each word
}

export function extractData(pattern, text) {
    var match = text.match(pattern);
    return match ? match[1].trim() : null;
}

export function convertDateFormat(dateStr) {
    var parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function selectDropdownOption(dropdownSelector, extractedValue) {
    var selectElement = document.querySelector(dropdownSelector);
    var options = selectElement.options;

    for (var i = 0; i < options.length; i++) {
        if (options[i].text === extractedValue) {
            options[i].selected = true;
            break;
        }
    }
}

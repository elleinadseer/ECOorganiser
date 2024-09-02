export function capitaliseFirstLetter(str) {
    return str
        .toLowerCase()                   // Convert the whole string to lowercase
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize the first letter of each word
}

export function extractData(pattern, text) {
    var match = text.match(pattern);
    return match ? match[1].trim() : null;
}

export function selectDropdownOption(dropdownSelector, extractedValue) {
    var selectElement = document.querySelector(dropdownSelector);
    if (!selectElement) {
        console.error('Dropdown element not found:', dropdownSelector);
        return;
    }

    var options = selectElement.options;
    var trimmedValue = extractedValue.trim();

    var found = false;
    for (var i = 0; i < options.length; i++) {
        if (options[i].text.trim().toLowerCase() === trimmedValue.toLowerCase()) {
            options[i].selected = true;
            found = true;
            break;
        }
    }

    if (!found) {
        console.error('Option not found in dropdown:', trimmedValue);
    }
}

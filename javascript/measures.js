const GASEinstallers = [
    "Jatinder Malhi",
    "Ben Williams",
    "Datinder Bhatti",
    "Kiran Sharma",
    "Mian Saeed",
    "Michael Fowler",
    "Nicholas Siddiqui",
    "Shaun Bartley",
    "Tajinder Singh",
    "Wayne Spooner",
    "Zorawar Heer"
]

// Data structure for measures
const measureData = {
    CWI: {
        company: "Energy Saving Group",
        installers: ["Steven Forbes"],
        materialUsed: "Provincial Seals Superwhite 40",
        PAScert: "OCEI34330"
    },
    ESH: {
        company: "Energy Saving Group",
        installers: ["Karim Bouariche"],
        materialUsed: "Elnur Ecombi HHR40",
        PAScert: "OCEI34330"
    },
    EWI: {
        company: "GOC Solutions LTD",
        installers: [ "Asen Toshev",
            "Faisal Rehman",
            "Marcin Persjanow",
            "Shakeel Sibtain"],
        materialUsed: "EWI Pro EWI System 18/5503",
        PAScert: ""
    },
    FRI: {
        company: "Energy Saving Group",
        installers: ["Saja Colley"],
        materialUsed: "Firestone RubberGard EPDM",
        PAScert: "OCEI34330"
    },
    FTCH: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: "Provide",
        PAScert: "OCEI34330"
    },
    GB: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: "Provide",
        PAScert: "OCEI34330"
    },
    GBU: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: "Provide",
        PAScert: "OCEI34330"
    },
    HC: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: "Provide",
        PAScert: "OCEI34330"
    },
    LC: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: "Provide",
        PAScert: "OCEI34330"
    },
    PRT: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: ["RADBOT 1 SCV100 ErP Class VIII"],
        PAScert: "OCEI34330"
    },
    ST: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    TRV: {
        company: "Energy Saving Group",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    IWI: {
        company: "Energy Saving Group",
        installers: [ "Abdelhadi Rakan Al Wadi",
            "Abed Alsalam",
            "Alex Martin",
            "Cameron Tyrell",
            "Danny Rossie",
            "Hardeep Khosla",
            "Ismaal Al Zaouki",
            "Josef Saadah",
            "Mahmood Jamil Ezaaoki",
            "Samuel Awad"],
        materialUsed: ["SWIP IWI System 18/5506", "SUPERFOIL SF19+"],
        PAScert: "OCEI34330"
    },
    FRI: {
        company: "Energy Saving Group",
        installers: ["Simon King", "Steven Brindle"],
        materialUsed: ["Knauf Earthwool Loftroll 44 BS EN 13501-1", "Isover Spacesaver Loftroll"],
        PAScert: "OCEI34330"
    },
    RIRI: {
        company: "Energy Saving Group",
        installers: [ "Abdelhadi Rakan Al Wadi",
            "Abed Alsalam",
            "Danny Rossie",
            "Hardeep Khosla",
            "Ismaal Al Zaouki",
            "Josef Saadah",
            "Mahmood Jamil Ezaaoki",
            "Samuel Awad",
            "Manjit Rahala"],
        materialUsed: ["SWIP + Knauf Earthwool Loftroll 44 BS EN 13501-1", "SWIP IWI System 18/5506"],
        PAScert: "OCEI34330"
    },

    /* MCS Measures */
    ASHP: {
        company: "Provide",
        installers: [  "Christopher Bealing",
            "Lewis Wothers",
            "Paul Baker"],
        materialUsed: "Provide",
        PAScert: ""
    },
    ASHP: {
        company: "Next Generation Utilities",
        installers: [  "Ryan Stokes",
        "Daniel Chadwick" ],
        materialUsed: "Jinko Cheetah HC 72M-V 390-410W",
        PAScert: "99505609" // This is NOT a PAScert, it falls under 'Certificate Number' - doesn't need to be fixed but be careful
    }
};

// Function to populate installer and material information
export function populateInstallerInfo(measure, measureIndex) {
    const data = measureData[measure];
    if (data) {
        // Populate installer company and PAS certificate
        document.getElementById(`m${measureIndex}installerCompany`).value = data.company;
        document.getElementById(`m${measureIndex}PAScertNum`).value = data.PAScert;

        // Get the existing dropdown for installer names
        const installerSelect = document.getElementById(`m${measureIndex}installerName`);
        
        if (installerSelect) {
            installerSelect.innerHTML = ""; // Clear previous options

            // Populate dropdown with installer names
            data.installers.forEach(installer => {
                const option = document.createElement("option");
                option.value = installer;
                option.text = installer;
                installerSelect.appendChild(option);
            });

            // Optionally, select the first installer if there's only one
            if (data.installers.length === 1) {
                installerSelect.selectedIndex = 0;
            }
        }

        // Get the existing dropdown for materials
        const materialSelect = document.getElementById(`m${measureIndex}material`);
        
        if (materialSelect) {
            materialSelect.innerHTML = ""; // Clear previous options

            // Create an option for the material used
            const option = document.createElement("option");
            option.value = data.materialUsed;
            option.text = data.materialUsed;
            materialSelect.appendChild(option);

            // Optionally, select the material if there's only one
            materialSelect.selectedIndex = 0;
        }
    }
}



// Add event listeners to each measure dropdown
document.addEventListener('DOMContentLoaded', function() {
    const measureDropdowns = [1, 2, 3, 4, 5].map(i => document.getElementById(`m${i}measureList`));

    measureDropdowns.forEach((dropdown, index) => {
        dropdown.addEventListener('change', function() {
            const selectedMeasure = dropdown.value;
            populateInstallerInfo(selectedMeasure, index + 1);
        });
    });
});


/*

var MeasureToInstallers = {
    "GBU": "GASE",
    "FTCH": "GASE",
    "LC": "GASE",
    "PRT": "GASE",
    "TRV": "GASE",
    "TTZC": "GASE",
    "ST": "GASE",
    "GB": "GASE",
    "HC": "GASE"
};

// Dictionary of possible installers for each measure.

if (verbose) console.println("[.Installer data tables]: Building InstallerLists.");

var InstallerLists = {
    "CWI": [
        "Steven Forbes"
    ],
    "IWI": [
        "Abdelhadi Rakan Al Wadi",
        "Abed Alsalam",
        "Alex Martin",
        "Cameron Tyrell",
        "Danny Rossie",
        "Hardeep Khosla",
        "Ismaal Al Zaouki",
        "Josef Saadah",
        "Mahmood Jamil Ezaaoki",
        "Samuel Awad"
    ],
    "IWI_GYPSUM": [
        "Antony Keegan"
    ],
    "IWI_WETHERBY": [
        "Abdelhadi Rakan Al Wadi",
        "Ahmaid Al Wadi",
        "Ameen Al Mawas",
        "Josef Saadah",
        "Mena Fawaz",
        "Moustafa Kenno",
        "Oday Kharroub",
        "Samuel Awad"
    ],
    "EWI": [
        "Asen Toshev",
        "Faisal Rehman",
        "Marcin Persjanow",
        "Shakeel Sibtain"
    ],
    "FRI": [
        "Saja Colley"
    ],
    "RIRI": [
        "Abdelhadi Rakan Al Wadi",
        "Abed Alsalam",
        "Danny Rossie",
        "Hardeep Khosla",
        "Ismaal Al Zaouki",
        "Josef Saadah",
        "Mahmood Jamil Ezaaoki",
        "Samuel Awad",
        "Manjit Rahala"
    ],
    "LI": [
        "Simon King",
        "Steven Brindle"
    ],
    "GASE": [
        "Ben Williams",
        "Datinder Bhatti",
        "Jatinder Malhi",
        "Kiran Sharma",
        "Mian Saeed",
        "Michael Fowler",
        "Nicholas Siddiqui",
        "Shaun Bartley",
        "Tajinder Singh",
        "Wayne Spooner",
        "Zorawar Heer"
    ],
    "ESH": [
        "Karim Bouariche"
    ],
    "ASHP": [
        "Christopher Bealing",
        "Lewis Wothers",
        "Paul Baker"
    ],
    "SPV": [
        "Ryan Stokes",
        "Daniel Chadwick"
    ]
};

*/
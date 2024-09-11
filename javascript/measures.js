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
    LI: {
        company:"Energy Saving Group LTD",
        installers: [ "Simon King", "Steven Brindle" ],
        materialUsed: [ "Knauf Earthwool Loftroll 44 BS EN 13501-1", 
            "Isover Spacesaver Loftroll" ],
        PAScert: "OCEI34330"
    },
    CWI: {
        company: "Energy Saving Group LTD",
        installers: ["Steven Forbes"],
        materialUsed: ["Provincial Seals Superwhite 40"],
        PAScert: "OCEI34330"
    },
    ESH: {
        company: "Energy Saving Group LTD",
        installers: ["Karim Bouariche"],
        materialUsed: ["Elnur Ecombi HHR40"],
        PAScert: "OCEI34330"
    },
    EWI: {
        company: "GOC Solutions LTD",
        installers: [ "Asen Toshev",
            "Faisal Rehman",
            "Marcin Persjanow",
            "Shakeel Sibtain"],
        materialUsed: ["EWI Pro EWI System 18/5503"],
        PAScert: ""
    },
    FRI: {
        company: "Energy Saving Group LTD",
        installers: ["Saja Colley"],
        materialUsed: ["Firestone RubberGard EPDM"],
        PAScert: "OCEI34330"
    },
    FTCH: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    GB: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    GBU: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    HC: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    LC: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    PRT: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["RADBOT 1 SCV100 ErP Class VIII"],
        PAScert: "OCEI34330"
    },
    ST: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    TRV: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["Provide"],
        PAScert: "OCEI34330"
    },
    IWI: {
        company: "Energy Saving Group LTD",
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
        company: "Energy Saving Group LTD",
        installers: ["Simon King", "Steven Brindle"],
        materialUsed: ["Knauf Earthwool Loftroll 44 BS EN 13501-1", "Isover Spacesaver Loftroll"],
        PAScert: "OCEI34330"
    },
    RIRI: {
        company: "Energy Saving Group LTD",
        installers: [ "Hardeep Khosla",
            "Abdelhadi Rakan Al Wadi",
            "Abed Alsalam",
            "Danny Rossie",
            "Ismaal Al Zaouki",
            "Josef Saadah",
            "Mahmood Jamil Ezaaoki",
            "Samuel Awad",
            "Manjit Rahala"],
        materialUsed: ["SWIP + Knauf Earthwool Loftroll 44 BS EN 13501-1", "SWIP IWI System 18/5506"],
        PAScert: "OCEI34330"
    },
    TTZC: {
        company: "Energy Saving Group LTD",
        installers: GASEinstallers,
        materialUsed: ["RADBOT 1 SCV100 ErP Class VIII"],
        PAScert: "OCEI34330"
    },

    /* MCS Measures */
    ASHP: {
        company: "Provide",
        installers: [  "Christopher Bealing",
            "Lewis Wothers",
            "Paul Baker"],
        materialUsed: ["Provide"],
        PAScert: ""
    },
    SPV: {
        company: "Next Generation Utilities",
        installers: [  "Ryan Stokes",
        "Daniel Chadwick" ],
        materialUsed: ["Jinko Cheetah HC 72M-V 390-410W"],
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

        // Get the existing dropdown for materials used
        const materialSelect = document.getElementById(`m${measureIndex}material`);
        console.log(materialSelect); // Check if this returns the correct element
        
        if (materialSelect) {
            materialSelect.innerHTML = ""; // Clear previous options
            console.log(data.materialUsed); // Check if data.materialUsed is correct
        
            data.materialUsed.forEach(material => {
                const option = document.createElement("option");
                option.value = material;
                option.text = material;
                materialSelect.appendChild(option);
            });
        
            // Optionally, select the first material if there's only one
            if (data.materialUsed.length === 1) {
                materialSelect.selectedIndex = 0;
            }
        } else {
            console.error("Element not found or incorrect ID");
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


/* COMPANIES CODE: 
var verbose = false;

// Data for installer companies.

function Company(companyObject) {
    this.address = companyObject.address || "";
    this.assessor = companyObject.assessor || "British Assessment Bureau";
    this.certificate = companyObject.certificate || "";
    this.getAddress = function() {return this.address;};
    this.getAssessor = function() {return this.assessor;};
    this.getCert = function() {return this.certificate;};
}

if (verbose) console.println("[.object Companies]: Building Companies.");

var Companies = {
    "Energy Saving Group LTD": new Company({
        address: "Mclaren Building, 46 The Priory Queensway, Birmingham, B4 7LR", 
        certificate: "OCEI34330",
    }),
    "GOC Solutions LTD": new Company({
        address: "343 Halliwell Road, Bolton, England, BL1 8DF"
    }),
    "Polar - ECO Services Limited": new Company({
        address: "100 Grange Street, Normanton, Derby, DE23 8HA",
        certificate: "NICI01509",
        assessor: "NICEIC"
    }),
    "Next Generation Utilities": new Company({
        address: "The Arrow Fifth Avenue, Team Valley Trading Estate, Gateshead, United Kingdom, NE11 0NG",
        certificate: "OCEI47702"
    }),
    "Utilisas Consultant Limited": new Company({
        address: "Unit 40 Meadowcroft Way, Leigh, United Kingdom, WN7 3XZ",
        certificate: "OCEI36297"
    }),
    "Mario Insulation Ltd": new Company({
        address: "Unit 35 Cable Street, Central Trading Estate, Wolverhampton, WV2 2RL",
        certificate: "OCEI51420"
    }),
    "STM Services (NW) Ltd": new Company({
        address: "11 Thornesgate Mews, Wakefield, West Yorkshire, WF2 8FJ",
        certificate: "OCEI51879"
    }),
    "GRS Insulation Ltd": new Company({
        address: "1 Brignell Road, Riverside Park, Middlesbrough, Teeside, TS2 1PS",
        certificate: "OCEI44120"
    }),
    "Fourwinds Energy Ltd": new Company({
        address: "Jhumat House 160, London Road, Barking, Essex, IG11 8BB",
        certificate: "OCEI53633"
    }),
    "Taggas LTD": new Company({
        address: "Unit 1 Ebor Court, Randall Park Way, Retford, DN22 8FQ"
    }),
    "Greentech Renewables LTD": new Company({
        address: "Unit 8 Park Road, Bury, BL9 5BQ"
    }),
    "Renew Energies Ltd": new Company({
        address: "119A Victoria Road West, Thornton Cleveleys, Lancashire, FY5 3LA"
    })
};


RETROFIT COORDS:
var RetrofitCoordinators = {
    "Jade Lindo": {
        company: "Independent Retrofit Coordinator",
        address: "56 Teviot Grove, Birmingham, B38 9JX",
        email: "Jaderetrofit@gmail.com",
        number: "07395 811415",
        trustmark: "2603950"
    },
    "Seema Joshi": {
        company: "Energy Saving Group LTD",
        address: Companies["Energy Saving Group LTD"].address,
        email: "joshijoshi82@gmail.com",
        number: "07703 782806",
        trustmark: "2601637"
    }
};
*/

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
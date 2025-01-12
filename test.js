stampdata = require("./json/stampdatabase.json")



function getStampDutyPercentages(stateName) {
    // Find the state in the data
    const stateData = stampdata.find(item => item.state === stateName);

    // Check if the state exists
    if (!stateData) {
        return `State "${stateName}" not found in the data.`;
    }

    // Return the percentages
    
        console.log(stateData.male_stamp_duty_percentage);
        console.log(stateData.female_stamp_duty_percentage);
   
}
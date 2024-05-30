const fs = require('node:fs');

try {
    const data = JSON.parse(fs.readFileSync('demographics.json', 'utf-8'));
    console.log(data[1]);
    let filteredData = data.filter(({state}) => 
        state == 'WI' || state == 'CT' || state == 'NH' || state == 'ME' || state == 'VT' ||
        state == 'RI' || state == 'MA' || state == 'NY' || state == 'NJ' || state == 'PA' ||
        state == 'DE' || state == 'MD' || state == 'DC' || state == 'VA' ||
        state == 'WV' || state == 'OH' || state == 'IN' || state == 'MI' || state == 'IL' ||
        state == 'KY' || state == 'MO' || state == 'IA' || state == 'MN');
    for (let i = 0; i < filteredData.length; i++) {
        let poc = filteredData[i].race.black_alone_male + filteredData[i].race.black_alone_female + filteredData[i].race.asian_alone_male +
        filteredData[i].race.asian_alone_female + filteredData[i].race.hispanic_male + filteredData[i].race.hispanic_female;
        filteredData[i] = Object.assign(filteredData[i], {POC: poc});
        delete filteredData[i].fips;
        delete filteredData[i].noaa;
        delete filteredData[i].zip_codes;
        delete filteredData[i].age;
        delete filteredData[i].male;
        delete filteredData[i].female;
        delete filteredData[i].population;
        delete filteredData[i].deaths;
        delete filteredData[i].bls;
        delete filteredData[i].fatal_police_shootings;
        delete filteredData[i].police_deaths;
        delete filteredData[i].avg_income;
        delete filteredData[i].covid_deaths;
        delete filteredData[i].covid_vaccination;
        delete filteredData[i].elections;
        delete filteredData[i].edu;
        delete filteredData[i].poverty_rate;
        delete filteredData[i].cost_of_living;
        delete filteredData[i].industry;
        delete filteredData[i].health;
        delete filteredData[i].covid_confirmed;
        delete filteredData[i].life_expectancy;
        delete filteredData[i].race;
        delete filteredData[i].land_area_km2;
        delete filteredData[i].area_km2;
        delete filteredData[i].latitude_deg;
        delete filteredData[i].longitude_deg;
    }
    
    try {
        fs.writeFileSync('filtered_county_demographics.json', JSON.stringify(filteredData));
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}
const fs = require('node:fs');

try {
    const data = JSON.parse(fs.readFileSync('georef-united-states-of-america-county.json', 'utf-8'));
    let filteredData = data.filter(({ste_name}) => 
        ste_name == 'Wisconsin' || ste_name == 'Connecticut' || ste_name == 'New Hampshire' || ste_name == 'Maine' || ste_name == 'Vermont' ||
        ste_name == 'Rhode Island' || ste_name == 'Massachusetts' || ste_name == 'New York' || ste_name == 'New Jersey' || ste_name == 'Pennsylvania' ||
        ste_name == 'Delaware' || ste_name == 'Maryland' || ste_name == 'District of Columbia' || ste_name == 'Virginia' ||
        ste_name == 'West Virginia' || ste_name == 'Ohio' || ste_name == 'Indiana' || ste_name == 'Michigan' || ste_name == 'Illinois' ||
        ste_name == 'Kentucky' || ste_name == 'Missouri' || ste_name == 'Iowa' || ste_name == 'Minnesota');
    for (let i = 0; i < filteredData.length; i++) {
        delete filteredData[i].geo_point_2d;
        delete filteredData[i].geo_shape;
        delete filteredData[i].year;
        delete filteredData[i].ste_code;
        delete filteredData[i].coty_code;
        delete filteredData[i].coty_area_code;
        delete filteredData[i].coty_type;
        delete filteredData[i].coty_name_long;
        delete filteredData[i].coty_fp_code;
        delete filteredData[i].coty_gnis_code;
    }
    
    try {
        fs.writeFileSync('filtered_county_list.json', JSON.stringify(filteredData));
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}

function csvToArr(stringVal, splitter) {
    const [keys, ...rest] = stringVal
      .trim()
      .split("\r\n")
      .map((item) => item.split(splitter));
  
    const formedArr = rest.map((item) => {
      const object = {};
      keys.forEach((key, index) => (object[key] = item.at(index)));
      return object;
    });
    return formedArr;
}
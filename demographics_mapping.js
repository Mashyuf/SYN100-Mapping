const fs = require('node:fs');
const options = {
    ignoreAttributes: false
};
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

try {
    const data = fs.readFileSync('demographics-map.kml', 'utf8');
    const table = JSON.parse(fs.readFileSync('filtered_county_demographics.json', 'utf8'));
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    console.log(rootFolder.Folder.length);
    console.log(table.length);
    for(let i = 0; i < table.length; i++) {
        try {
            assignColor(rootFolder.Folder[i].Placemark, table[i].POC);
        } catch(err) {
            assignColor(rootFolder.Folder[i].Placemark, table[i].POC);
        }
        
    };

    const builder = new XMLBuilder(options);
    let xml = builder.build(jObj);

    try {
        fs.writeFileSync('demographics-map.kml', xml)
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}

function assignColor(location, race) {
    if (race < 0.1) {
        location = Object.assign(location, {styleUrl: "#USCountiesWhite"});
    } else if (race >= 0.1 && race < 0.2) {
        location = Object.assign(location, {styleUrl: "USCountiesPink"});
    } else if (race >= 0.2 && race < 0.33) {
        location = Object.assign(location, {styleUrl: "#USCountiesDarkPink"});
    } else if (race >= 0.33 && race < 0.5) {
        location = Object.assign(location, {styleUrl: "USCountiesLightRed"});
    } else if (race >= 0.5) {
        location = Object.assign(location, {styleUrl: "USCountiesRed"});
    }
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

const fs = require('node:fs');
const options = {
    ignoreAttributes: false
};
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

try {
    const data = fs.readFileSync('Counties.kml', 'utf8');
    const table = JSON.parse(fs.readFileSync('filtered_county_demographics.json', 'utf8'));
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    console.log(rootFolder.Folder.length);
    console.log(table.length);
    for(let i = 0; i < table.length; i++) {
        try {
            let folder = rootFolder.Folder[i].Placemark.MultiGeometry;
            assignColor(rootFolder.Folder[i].Placemark, tableArr[i].race);
        } catch(err) {
            let folder = rootFolder.Folder[i].Placemark;
            assignColor(rootFolder.Folder[i].Placemark, tableArr[i].race);
        }
        
    };

    const builder = new XMLBuilder(options);
    let xml = builder.build(jObj);

    try {
        fs.writeFileSync('complete-map.kml', xml)
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}

function assignColor(location, race) {
    if (race < 0.1) {
        location = Object.assign(location, {styleUrl: "#USCountiesRed"});
    } else if (race >= 0.1 && race < 0.2) {
        location = Object.assign(location, {styleUrl: "USCountiesOrange"});
    } else if (race >= 0.2 && race < 0.33) {
        location = Object.assign(location, {styleUrl: "#USCountiesYellow"});
    } else if (race >= 0.33 && race < 0.5) {
        location = Object.assign(location, {styleUrl: "USCountiesDarkGreen"});
    } else if (race >= 0.5) {
        location = Object.assign(location, {styleUrl: "USCountiesDarkGreen"});
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

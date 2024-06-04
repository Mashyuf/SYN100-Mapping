const fs = require('node:fs');
const options = {
    ignoreAttributes: false
};
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

try {
    const data = fs.readFileSync('Counties.kml', 'utf8');
    const table = fs.readFileSync('Table_2012.csv', 'utf8');
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    let tableArr = csvToArr(table, ',');
    console.log(rootFolder.Folder.length);
    console.log(tableArr.length);
    for(let i = 0; i < tableArr.length; i++) {
        try {
            let folder = rootFolder.Folder[i].Placemark.MultiGeometry;
            let coordinatesStr = folder.Polygon.outerBoundaryIs.LinearRing.coordinates;
            folder = Object.assign(folder, {extrude: 1, altitudeMode: "relativeToGround"});
            folder.Polygon = Object.assign(folder.Polygon, {extrude: 1, altitudeMode: "relativeToGround"});
            coordinatesStr = coordinatesStr.replaceAll(',0', ',' + tableArr[i].Income);
            folder.Polygon.outerBoundaryIs.LinearRing = Object.assign(folder.Polygon.outerBoundaryIs.LinearRing, {coordinates: coordinatesStr});
            assignColor(rootFolder.Folder[i].Placemark, tableArr[i].Income);
        } catch(err) {
            let folder = rootFolder.Folder[i].Placemark;
            let coordinatesStr = folder.Polygon.outerBoundaryIs.LinearRing.coordinates;
            folder = Object.assign(folder, {extrude: 1, altitudeMode: "relativeToGround"});
            folder.Polygon = Object.assign(folder.Polygon, {extrude: 1, altitudeMode: "relativeToGround"});
            coordinatesStr = coordinatesStr.replaceAll(',0', ',' + tableArr[i].Income);
            folder.Polygon.outerBoundaryIs.LinearRing = Object.assign(folder.Polygon.outerBoundaryIs.LinearRing, {coordinates: coordinatesStr});
            assignColor(rootFolder.Folder[i].Placemark, tableArr[i].Income);
        }
        
    };

    const builder = new XMLBuilder(options);
    let xml = builder.build(jObj);

    try {
        fs.writeFileSync('income_2012.kml', xml)
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}

function assignColor(location, income) {
    if (income < 30000) {
        location = Object.assign(location, {styleUrl: "#USCountiesRed"});
    } else if (income >= 30000 && income < 40000) {
        location = Object.assign(location, {styleUrl: "USCountiesOrange"});
    } else if (income >= 40000 && income < 50000) {
        location = Object.assign(location, {styleUrl: "#USCountiesYellow"});
    } else if (income >= 50000 && income < 60000) {
        location = Object.assign(location, {styleUrl: "USCountiesLightGreen"});
    } else if (income >= 60000 && income < 70000) {
        location = Object.assign(location, {styleUrl: "USCountiesGreen"});
    } else if (income >= 70000) {
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

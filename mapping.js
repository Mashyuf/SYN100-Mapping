const fs = require('node:fs');
const options = {
    ignoreAttributes: false
};
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

try {
    const data = fs.readFileSync('map.kml', 'utf8');
    const wisconsin = fs.readFileSync('Table.csv', 'utf8');
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    let wisconsinArr = csvToArr(wisconsin, ',');
    for(let i = 0; i < wisconsinArr.length; i++) {
        rootFolder.Folder[i] = Object.assign(rootFolder.Folder[i], {name: wisconsinArr[i].GeoName});
        let folder = rootFolder.Folder[i].Placemark.MultiGeometry;
        let coordinatesStr = folder.Polygon.outerBoundaryIs.LinearRing.coordinates;
        folder = Object.assign(folder, {extrude: 1, altitudeMode: "relativeToGround"});
        folder.Polygon = Object.assign(folder.Polygon, {extrude: 1, altitudeMode: "relativeToGround"});
        coordinatesStr = coordinatesStr.replaceAll(',0', ',' + wisconsinArr[i].Income);
        folder.Polygon.outerBoundaryIs.LinearRing = Object.assign(folder.Polygon.outerBoundaryIs.LinearRing, {coordinates: coordinatesStr});
        assignColor(rootFolder.Folder[i].Placemark, wisconsinArr[i].Income);
        console.log(coordinatesStr);
    };

    const builder = new XMLBuilder(options);
    let xml = builder.build(jObj);

    try {
        fs.writeFileSync('test.kml', xml)
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}

function assignColor(location, income) {
    if (income < 20000) {
        location = Object.assign(location, {styleUrl: "#USCountiesRed"});
    } else if (income >= 20000 && income < 30000) {
        location = Object.assign(location, {styleUrl: "USCountiesOrange"});
    } else if (income >= 30000 && income < 40000) {
        location = Object.assign(location, {styleUrl: "#USCountiesYellow"});
    } else if (income >= 40000 && income < 50000) {
        location = Object.assign(location, {styleUrl: "USCountiesLightGreen"});
    } else if (income >= 50000 && income < 60000) {
        location = Object.assign(location, {styleUrl: "USCountiesGreens"});
    } else if (income >= 60000) {
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

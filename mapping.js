const fs = require('node:fs');

const options = {
    ignoreAttributes: false
};

const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

try {
    const data = fs.readFileSync('map.kml', "utf8");
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    console.log(rootFolder.Folder[0].Placemark.MultiGeometry.Polygon);



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


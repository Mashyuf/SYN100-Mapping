const fs = require('node:fs');
const options = {
    ignoreAttributes: false
};
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const { count } = require('node:console');

try {
    const data = fs.readFileSync('map.kml', 'utf8');
    const counties = JSON.parse(fs.readFileSync('filtered_county_list.json', 'utf8'));
    const parser = new XMLParser(options);
    let jObj = parser.parse(data);
    console.log('read file success');
    const rootFolder = jObj.kml.Document.Folder;
    console.log(rootFolder.Folder.length);
    for(let i = 0; i < counties.length; i++) {
        rootFolder.Folder[i] = Object.assign(rootFolder.Folder[i], {name: counties[i].coty_name + ', ' + counties[i].ste_name});
        console.log(i);
        console.log(rootFolder.Folder[i]);
    };

    const builder = new XMLBuilder(options);
    let xml = builder.build(jObj);

    try {
        fs.writeFileSync('counties.kml', xml)
        console.log('write file success');
    } catch (err) {
        console.log(err);
    }
} catch (err) {
    console.log(err);
}
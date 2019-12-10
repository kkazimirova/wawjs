const http = require('http');
const path = require('path');
const fs = require('fs');

const endpoint = 'http://localhost:3000/gzip';

let arguments = process.argv.slice(2);
let filePath = arguments[0];
let fileName = path.basename(filePath);

if (!filePath) {
	console.error("File path can not be empty");
	process.exit();
}

let readStream = fs.createReadStream(filePath);
readStream.on('error', (err) => {
	console.error("Can not open file");
	process.exit();
})

let request = http.request(endpoint, {method: 'POST'}).on('response', (response) => {
	let writeStream = fs.createWriteStream(filePath + '.gzip');
	writeStream.on('finish', () => {
		console.log("File was compressed");
	})

	response.pipe(writeStream);
});

request.setHeader('file-name', fileName);

readStream.pipe(request);



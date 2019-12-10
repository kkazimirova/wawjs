const http = require('http');
const fs = require('fs');
const zlib = require('zlib');
const stream = require('stream');

const hostname = '127.0.0.1';
const port = 3000;
const uploadDir = './uploads/';

const server = http.createServer((request, response) => {

	if (request.url == '/gzip' && request.method == 'POST') {
		try {
			gzipFile(request, response);
		 } catch (e) {
			response.write(Buffer.from(e));
			response.statusCode = 500;
			response.end();
		 }
	} else {
		response.statusCode = 404;
		response.end();
	}

});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function gzipFile(request, response) {
	let fileName = getFileName(request);
	let path = getUploadPath(fileName);

	let writeStream = fs.createWriteStream(path);
	writeStream.on('error', (err) => {
		response.statusCode = 500;
		response.write('Can not upload file');
		response.end();
	});

	stream.pipeline(
		request,
		writeStream,
		(err) => {
			if (!err) {
				let readStream = fs.createReadStream(path);

				stream.pipeline(
					readStream,
					zlib.createGzip(),
					response,
					(err) => {
						response.write('Can not compress file');
						response.statusCode = 500;
						response.end();
					}
				)
			}
		}
	);
}

function getFileName(request) {
	let fileName = request.headers['file-name'];

	if (!fileName) {
		throw 'Missing file name in file-name HTTP header';
	}

	return fileName;
}

function getUploadPath(fileName) {
	return uploadDir + fileName;
}
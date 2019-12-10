const { exec } = require('child_process')

function handleOutput(error, stdout, stderr) {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    
    if (error !== null) {
        console.log(`exec error: ${error}`);
    }

    console.log('------------');
}

exec('node ../src/zip-server.js');

setTimeout(function(){
    exec('node ../src/zip-client.js ../src/files/test1.txt', handleOutput);
	exec('node ../src/zip-client.js ../src/files/test2.txt', handleOutput);
}, 5000);

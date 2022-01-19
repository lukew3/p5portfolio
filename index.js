const pug = require('pug');
const fs = require('fs');
const chokidar = require('chokidar');
const express = require('express');
const open = require('open');

const main = () => {
	const mode = process.argv[2];
	if (mode === 'watch')
		watch();
	else if (mode === 'build')
		build();
}

const makeDist = () => {
	// make dist folder if it doesn't exist
	if (!fs.existsSync('./dist')){
    		fs.mkdirSync('./dist');
	}
	// copy p5 files
	fs.copyFile('./node_modules/p5/lib/p5.min.js', './dist/p5.min.js', (err) => {
		if (err) console.log(err);
	});
	fs.copyFile('./node_modules/p5/lib/addons/p5.sound.min.js', './dist/p5.sound.min.js', (err) => {
		if (err) console.log(err);
	});
	// copy user css and js files
	fs.copyFile('./src/styles.css', './dist/styles.css', (err) => {
		if (err) console.log(err);
	});
	fs.copyFile('./src/main.js', './dist/main.js', (err) => {
		if (err) console.log(err);
	});
}

const build = async () => {
	console.log('building new version...');
	makeDist();
	let config = JSON.parse(fs.readFileSync('./src/config.json'));
	fs.readdir('./src/projects', (err, contents) => {
		// contents should all be directories with the name of the project
		// Add all directory names to config.projects
		config.projects = contents;
		console.log(config);
		let fn = pug.renderFile('./src/index.pug', config);
		fs.writeFile('./dist/index.html', fn, (err)=>{
			if (err) console.log(err);
		});
	});
}

const watch = () => {
	build();
	chokidar.watch('./src', {ignoreInitial: true}).on('all', () => {
		build();
	});
	const server = express();
	server.use(express.static('./dist'));
	server.listen(3000);
	console.log('Server running at localhost:5000');
	open('localhost:3000');
}

main();

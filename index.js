const pug = require('pug');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const express = require('express');
const open = require('open');
const bs = require('browser-sync');

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
	fs.copyFile('./src/style.css', './dist/style.css', (err) => {
		if (err) console.log(err);
	});
	/*
	 * Removed since no js outside of p5 will be needed
	fs.copyFile('./src/main.js', './dist/main.js', (err) => {
		if (err) console.log(err);
	});
	*/
}

const build = async () => {
	console.log('building new version...');
	makeDist();
	let config = JSON.parse(fs.readFileSync('./src/config.json'));
	fs.readdir('./src/projects', (err, projectDirs) => {
		// contents should all be directories with the name of the project
		// Add all directory names to config.projects
		config.projects = projectDirs;
		console.log(config);
		let fn = pug.renderFile('./src/index.pug', config);
		fs.writeFile('./dist/index.html', fn, (err)=>{
			if (err) console.log(err);
		});
		projectDirs.forEach((projectName) => {
			let fn = pug.renderFile('./src/sketch.pug', {projectName});
			fs.writeFile(`./dist/${projectName}.html`, fn, (err) => {
				if (err) console.log(err);
			});
			// copy project folder to dist
			fs.copy(`./src/projects/${projectName}`, `./dist/${projectName}`, (err) => {
				if (err) console.log(err);
			});
		});
	});
}

const watch = () => {
	build();
	bs.init({
		server: './dist'
	});
	chokidar.watch('./src', {ignoreInitial: true}).on('all', () => {
		build();
		bs.reload();
	});
}

main();

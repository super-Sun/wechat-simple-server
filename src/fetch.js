'use strict';

const http = require('http');
const https = require('https');

module.exports.get = url => {
	const H = url.includes('https://') ? https : http;

	return new Promise((resolve, reject) => {
		H.get(url, res => {
			res.on('data', d => {
				resolve(JSON.parse(d));
			});
		}).on('error', e => {
			reject(e);
		});
	});
}

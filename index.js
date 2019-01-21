var app = require('koa')();
var router = require('koa-router')();

const APIService = require('./src/service');

router.get('/', function*() {
	this.body = 'Hello World';
})

router.get('/api-wechat/access_token/get', function*(next) {
	const accessToken = yield APIService.getAccessToken();
	this.body = {
		accessToken
	};
});

router.get('/api-wechat/jsapi_ticket/get', function*(next) {
	const jsapiTicket = yield APIService.getJSAPITicket();
	this.body = {
		jsapiTicket
	};
});

router.get('/api-wechat/signature/get', function*(next) {
	const signatureConf = yield APIService.getSignature(decodeURIComponent(this.query.url));
	this.body = signatureConf;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(function*(next) {
	if (this.status === 404) {
		this.body = 'You are lost in the world!';
	} else {
		yield next;
	}
});

const port = 3000;
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});

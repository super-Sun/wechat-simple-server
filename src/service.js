const jsSHA = require("jssha/src/sha1.js");
const fetch = require('./fetch');
const config = require('./config');

const wechatConf = {};

module.exports = {
	getAccessToken() {
	
		if (wechatConf.accessToken && wechatConf.accessTokenTime + 72000 > +new Date()) {
			return Promise.resolve(wechatConf.accessToken);
		}
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`;
		return fetch.get(url)
			.then(response => {
				wechatConf.accessToken = response.access_token;
				wechatConf.accessTokenTime = +new Date();
				console.log(JSON.stringify(response))
				return wechatConf.accessToken;
			}).catch(err => {
				console.log(JSON.stringify(err))
			});
	},

	getJSAPITicket() {
		return this.getAccessToken().then(accessToken => {
			if (wechatConf.JSAPITicket && wechatConf.JSAPITicketTime + 72000 > +new Date()) {
				return Promise.resolve(wechatConf.JSAPITicket);
			}

			return fetch.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`)
				.then(response => {
					wechatConf.JSAPITicket = response.ticket;
					wechatConf.JSAPITicketTime = +new Date();
					return wechatConf.JSAPITicket;
				});
		});
	},

	getSignature(url) {
		const noncestr = 'WECHAT_API_SERVICE';
		const timestamp = 12345;

		return this.getJSAPITicket().then(jsapiTicket => {
			const shaObj = new jsSHA('SHA-1', 'TEXT');
			const signatureStr = `jsapi_ticket=${jsapiTicket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
			shaObj.update(signatureStr);
			return {
				nonceStr: noncestr,
				timestamp,
				url,
				appId: config.appId,
				signature: shaObj.getHash("HEX")
			};
		});
	}
};

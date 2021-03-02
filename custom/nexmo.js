const Nexmo = require('nexmo');
let sendIt = false;
const sendSms = (to, text) => {
	const nexmo = new Nexmo({
		apiKey: process.env.NEXMO_API_KEY,
		apiSecret: process.env.NEXMO_API_KEY_SECRET,
	});

	text = '[CIT API] ' + text;

	if (sendIt) nexmo.message.sendSms('ServerGuard', to, text);
};

module.exports = sendSms;

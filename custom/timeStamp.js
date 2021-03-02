const timeStamp = () => {
	let year = new Date().getFullYear() + '.';
	let month = new Date().getMonth() + '.';
	let day = new Date().getDay() + ' ';
	let hour = new Date().getHours() + ':';
	let minute = new Date().getMinutes() + ':';
	let second = new Date().getSeconds() + '.';
	let milisec = new Date().getMilliseconds();
	return year + month + day + hour + minute + second + milisec;
};

module.exports = timeStamp;

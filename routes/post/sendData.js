const express = require('express');
const router = express.Router();
const apiAuth = require('../../custom/apiAuth');
const createConn = require('../../custom/mysqlCustom');

router.post('/', (req, res) => {
	//Extract data
	let card_num = req.body.card_num;
	let api_name = req.body.api_name;
	let api_passwd = req.body.api_passwd;

	//Is enough data provided?
	if (card_num == undefined) {
		res.status(400).json({
			code: 400,
			message: 'Missing card number',
		});
	} else if (api_name == undefined) {
		res.status(400).json({
			code: 400,
			message: 'Missing API name',
		});
	} else if (api_passwd == undefined) {
		res.status(400).json({
			code: 400,
			message: 'Missing API passwd',
		});
	} else {
		apiAuth(api_name, api_passwd, (err) => {
			if (err)
				res.status(err[0]).json({
					code: err[0],
					message: err[1],
				});
			else {
				let sql = 'SELECT idUser, name FROM user WHERE cardNumber=?';
				let params = [card_num];

				createConn(sql, params, (err, result) => {
					if (err)
						res.status(err[0]).json({
							code: err[0],
							message: err[1],
						});
					else {
						//V primeru, da ni uporabnika v bazi s to številko kartice, vrne le to
						if (result.length == 0)
							res.status(200).json({
								code: 200,
								message: card_num,
							});
						else {
							let name = result[0].name;
							let id = result[0].idUser;

							//Želimo vstaviti čas kdaj je delavec prišel delat
							sql = 'INSERT INTO time(time, idUser) VALUES(now(), ?)';
							params = [id];

							createConn(sql, params, (err, result) => {
								if (err)
									res.status(err[0]).json({
										code: err[0],
										message: err[1],
									});
								else {
									//Poizvedemo kolikokrat se je že danes počekiral
									sql =
										"SELECT count(time) AS number FROM  time where idUser=? AND date_format(now(), '%d.%m.%y') LIKE date_format(time, '%d.%m.%y')";
									params = [id];

									createConn(sql, params, (err, result) => {
										if (err)
											res.status(err[0]).json({
												code: err[0],
												message: err[1],
											});
										else {
											if (result.length <= 0)
												res.status(500).json({
													code: 500,
													message: 'SQL internal Error',
												});
											else {
												let number = result[0].number;

												number = number - 1;

												if (number % 2 == 0) {
													res.status(200).json({
														code: 200,
														message: 'Živijo ' + name,
													}); // Users name response
												} else {
													res.status(200).json({
														code: 200,
														message: 'Nasvidenje ' + name,
													}); // Users name response
												}

												//Vstavimo še event
												sql = 'INSERT INTO event(description, idUser, time) VALUES(? ,? , now())';
												params = [name + ' just checked himself', id];

												createConn(sql, params, (err, result) => {
													if (err)
														res.status(err[0]).json({
															code: err[0],
															message: err[1],
														});
												});
											}
										}
									});
								}
							});
						}
					}
				});
			}
		});
	}
});

module.exports = router;

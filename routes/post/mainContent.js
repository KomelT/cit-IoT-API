const express = require('express');
const router = express.Router();
const apiAuth = require('../../custom/apiAuth');
const createConn = require('../../custom/mysqlCustom');

router.post('/', (req, res) => {
	//Extract data
	let token_id = req.body.token_id;
	let api_name = req.body.api_name;
	let api_passwd = req.body.api_passwd;

	//Is enough data provided?
	if (token_id == undefined) {
		res.status(400).json({
			code: 400,
			message: 'Missing token ID',
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
				let name = "Error";
				let lastName = "Error";
				let id = 0;

				let workers = [0, 0, 0, 0];

				let dates = [];

				let vacation = [null, null, []];

				let sql = 'SELECT user.name,  user.lastName, user.idUser FROM user INNER JOIN session ON user.idUser = session.idUser where idSession = ?';
				let params = [token_id];

				createConn(sql, params, (err, result) => {
					if (err)
						res.status(err[0]).json({
							code: err[0],
							message: err[1],
						});
					else {
						if (result.length == 0) {
							res.status(500).json({
								code: 500,
								message: "No user found!",
							});
						}
						else {
							name = result[0].name;
							lastName = result[0].lastName;
							id = result[0].idUser;

							let now = new Date();
							let day = now.getDay() - 1;

							if (day == -1) {
								for (i = 0; i < 7; i++) {
									let custom = new Date(now.toISOString());
									custom.setDate(custom.getDate() - i);
									dates.push(custom);
								}
								dates.reverse();
							} else {
								now.setDate(now.getDate() - day);
								for (i = 0; i < 7; i++) {
									let custom = new Date(now);
									custom.setDate(custom.getDate() + i);
									dates.push(custom);
								}
							}

							sql = `select count(*) as st, idUser from time where time > STR_TO_DATE(DATE_FORMAT(now(), "%Y-%m-%d") , '%Y-%m-%d') group by idUser`;

							createConn(sql, params, (err, result) => {
								if (err)
									res.status(err[0]).json({
										code: err[0],
										message: err[1],
									});
								else {
									if (result.length == 0)
										workers[0] = 0;
									else {
										for (i = 0; i < result.length; i++) {
											if (result[i].st % 2 == 1) {
												workers[0]++
											}
										}
									}

									sql = "SELECT COUNT(cardNumber) AS st FROM user";

									createConn(sql, params, (err, result) => {
										if (err)
											res.status(err[0]).json({
												code: err[0],
												message: err[1],
											});
										else {
											if (result.length == 0) {
												res.status(500).json({
													code: 500,
													message: "No user found!",
												});
											}
											else {
												workers[3] = result[0].st
												workers[1] = result[0].st - workers[0]
											}

											sql = "SELECT days from vacation_ass where idUser = ? && year = year(now())";
											params = [id];

											createConn(sql, params, (err, result) => {
												if (err)
													res.status(err[0]).json({
														code: err[0],
														message: err[1],
													});
												else {
													if (result.length == 0)
														vacation[0] = 0;
													else {
														vacation[0] = result[0].days;
													}
													sql = "SELECT concat(name, '(', first_day, ')') as first_day, DATEDIFF(last_day, first_day) + 1 as duration from vacation_res where  last_day > now() && idUser = ?";
													params = [id];

													createConn(sql, params, (err, result) => {
														if (err)
															res.status(err[0]).json({
																code: err[0],
																message: err[1],
															});
														else {
															if (result.length == 0) {
																vacation[2].push([null, null]);
																vacation[1] = 0;
															}
															else {
																for (i = 0; i < result.length; i++) {
																	vacation[2].push([result[i].first_day, result[i].duration]);
																	vacation[1] = vacation[1] + result[i].duration;
																}
															}

															vacation[0] = vacation[0] - vacation[1];


															res.status(200).json({
																code: 200,
																name: name,
																lastName: lastName,
																workers: workers,
																dates: dates,
																vacation: vacation
															});
														}
													})

												}
											})
										}
									})
								}
							})


						}
					}
				});

			}
		})
	}
})

module.exports = router;
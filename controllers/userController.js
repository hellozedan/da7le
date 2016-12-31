/**
 * Created by ahmad on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var Friendship = require('../models/friendship');
var Report = require('../models/report');

var mongoose = require('mongoose');
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("Wc8F0RTWYFg7TcTv0iQNbosIYhE1LC6fzitiuCNY");

var Match = require('../models/match');

var fbController = require('../controllers/fbController');

var userController = function (User) {

	var post = function (req, res) {
		var user = req.body;
		if (!req.body.phone_number) {
			res.status(500).send("error");
		}
		var query = {};
		query.phone_number = user.phone_number
		User.find(query, function (err, users) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				if (users == null || users.length <= 0) {
					console.log('This is a new user.');
					user.activation_code = Math.floor(Math.random() * 90000) + 10000;
					var newUser = new User(user);
					newUser.save(function (e) {
						if (e) {
							res.status(500).send("error"); //sending back status 201 which means it was created.
						} else {

							res.status(201).send(newUser); //sending back status 201 which means it was created.

						}
					});
				} else {
					// we already have this user, so use the old user.
					var currentUser = users[0];
					currentUser.activation_code = Math.floor(Math.random() * 90000) + 10000;
					currentUser.save(function (e) {
						if (e) {
							console.log('Error saving user. ' + e.message);
							res.status(500).send("error");
						} else {
							console.log('User Saved ok.');
							res.status(201).send(currentUser);
							/**/
						}
					});
				}
			}
		});
	};

	var invite = function (req, res) {
		{

			var user = req.body;
			if (!req.body.users) {
				res.status(500).send("error");
			}
			else {
				inviteAllFriends(req.body.users, req.authuser, 0, req)

			}

		}
		function inviteAllFriends(allusers, ThisUser, index, req) {
			if (allusers.length === index) {
				res.status(201).send(ThisUser);
				return;
			}
			inviteFriend(allusers[index], ThisUser).then(function (result) {
				inviteAllFriends(allusers, ThisUser, ++index, req)
			}, function (err) {
				res.status(500).send("error");
			});
		}
	}

	var inviteFriend = function (user, ThisUser) {
		return new Promise(function (resolve, reject) {
			var query = {};
			query.phone_number = user.phone_number;
			User.find(query, function (err, users) {
				if (err) {
					console.log(err);
					reject('errZ');
				} else {
					//User not exit, sending sms and create a new user in our app
					if (users == null || users.length <= 0) {
						console.log('This is a new user. we need to send sms');
						// send msg
						//create user

						//check phone number

						//create new user
						var newUser = new User(user);
						newUser.save(function (e) {
							if (e) {
								reject('err'); //sending back status 201 which means it was created.
							} else {
								//add user to author user's freinds
								if (!ThisUser.friends)
									ThisUser.friends = [];
								ThisUser.friends.push(
									{
										_id: newUser._id,
										nickname: user.nickname,
										phone_number: newUser.phone_number,
										dahleTime: new Date()
									}
								);
								ThisUser.save(function (e) {
									if (e) {
										console.log('Error saving user. ' + e.message);
										reject('err');
									} else {
										if (!newUser.friends)
											newUser.friends = [];
										newUser.friends.push(
											{
												_id: ThisUser._id,
												nickname: ThisUser.phone_number,
												phone_number: ThisUser.phone_number
											}
										);
										newUser.save(function (e) {
											if (e) {
												console.log('Error saving user. ' + e.message);
												reject('err');
											} else {
												console.log('User Saved ok.');
												resolve(ThisUser);
											}
										})

									}
								});


							}
						});


						// add author user to new user's friends


					} else {
						// find if they are friends
						var exitInList = -1;
						var dalhleUser = users[0];

						for (var i = 0; i < ThisUser.friends.length; i++) {
							//they are friends so send notification
							if (ThisUser.friends[i]._id.toString() === dalhleUser._id.toString()) {
								//send da7le
								exitInList = i;
							}
						}

						if (exitInList >= 0) {
							var friends = JSON.parse(JSON.stringify(ThisUser.friends));
							friends[exitInList].dahleTime = new Date();
							ThisUser.friends = friends;
							ThisUser.save(function (e) {
								if (e) {
									console.log('Error saving user. ' + e.message);
									reject('err');
								} else {
									console.log('User Saved ok.');
									resolve(ThisUser);
								}
							});
						}

						//they are not friends so add to friends, and send notification
						else if (exitInList == -1) {
							if (!ThisUser.friends)
								ThisUser.friends = [];
							ThisUser.friends.push(
								{
									_id: dalhleUser._id,
									phone_number: user.phone_number,
									nickname: user.nickname,
									dahleTime: new Date()
								}
							);
							//send notification;
							ThisUser.save(function (e) {
								if (e) {
									console.log('Error saving user. ' + e.message);
									reject('err');
								} else {
									if (!dalhleUser.friends)
										dalhleUser.friends = [];
									dalhleUser.friends.push(
										{
											_id: ThisUser._id,
											phone_number: ThisUser.phone_number,
											nickname: ThisUser.phone_number
										}
									);
									//send notification;
									dalhleUser.save(function (e) {
										if (e) {
											console.log('Error saving user. ' + e.message);
											reject('err');
										} else {
											console.log('User Saved ok.');
											resolve(ThisUser);
										}
									});
								}
							});

						}
					}
				}
			});
		});
	};
	var getFriends = function (req, res) {
		var friendsId;
		friendsId = req.authuser.friends.map(function (a) {
			return a._id;
		});
		User.find({_id: {$in: friendsId}}, function (err, friends) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				if (friends == null || friends.length <= 0) {
					console.log('No Friends');
				}
				res.status(201).send(friends);
			}
		});


	};

	var sendDahle= function (req, res)
		{
			var ThisUser = req.authuser;
			var user = req.body;

			for (var i = 0; i < ThisUser.friends.length; i++) {
				//they are friends so send notification
				if (ThisUser.friends[i]._id.toString() === user._id.toString()) {
					//send da7le
					var friends = JSON.parse(JSON.stringify(ThisUser.friends));
					friends[i].dahleTime = new Date();
					ThisUser.friends = friends;
					ThisUser.save(function (e) {
						if (e) {
							console.log('Error saving user. ' + e.message);
							res.status(500).send("error");
						} else {
							console.log('User Saved ok.');
							//send notification
							res.status(201).send(ThisUser);

						}
					});
				}
			}


		}
	var match = function (req, res) {
		var mainPerson = req.body.mainPerson;
		var otherPersons = req.body.otherPersons;
		if (!mainPerson && !otherPersons) {
			res.status(500).send("error");
		}
		var newMatch = new Match({user_id: req.authuser._id, match: req.body});
		newMatch.save(function (e) {
			if (e) {
				res.status(500).send("error"); //sending back status 201 which means it was created.
			} else {
			}
		});
		var query = {};
		query.phone_number = mainPerson.phone_number;
		User.find(query, function (err, users) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				if (users == null || users.length <= 0) {
					console.log('This is a new user.');
					var user = {phone_number: mainPerson.phone_number, contactName: mainPerson.contactName};
					var newUser = new User(user);
					newUser.save(function (e) {
						if (e) {
							res.status(500).send("error"); //sending back status 201 which means it was created.
						} else {
							mainPerson = newUser;
							checkOtherUsers(0);
						}
					});
				}
				else {
					mainPerson = users[0];
					checkOtherUsers(0);
				}
			}
		});
		function checkOtherUsers(i) {
			if (i >= otherPersons.length) {
				res.status(201).send({mainPerson: mainPerson, otherPersons: otherPersons, match_id: newMatch._id});
			}
			else {
				var query = {};
				query.phone_number = otherPersons[i].phone_number;
				User.find(query, function (err, users) {
					if (err) {
						console.log(err);
						console.log(err);
						res.status(500).send(err);
					} else {
						if (users == null || users.length <= 0) {
							console.log('This is a new user.');
							var user = {
								phone_number: otherPersons[i].phone_number,
								contactName: otherPersons[i].contactName
							};
							var newUser = new User(user);
							newUser.save(function (e) {
								if (e) {
									res.status(500).send("error"); //sending back status 201 which means it was created.
								} else {
									otherPersons[i] = newUser;
									checkOtherUsers(++i);
								}
							});
						}
						else {
							otherPersons[i] = users[0];
							checkOtherUsers(++i);
						}
					}
				});
			}
		}
	};
	var confirm = function (req, res) {
		var user = {};
		if ((!req.body._id) && (!req.body.activation_code)) {
			res.status(500).send("error");
			return;
		}
		user = req.body;
		User.find(user, function (err, users) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				if (users == null || users.length <= 0) {
					res.status(500).send("error");
				} else {
					// we already have this user, so use the old user.
					var currentUser = users[0];
					currentUser.confirmed_date = new Date();
					var token = require('crypto').randomBytes(64).toString('hex');
					currentUser.token = token
					currentUser.save(function (e) {
						if (e) {
							console.log('Error saving user. ' + e.message);
							res.status(500).send("error");
						} else {
							console.log('User Saved ok.');
							res.status(201).send(currentUser);
							/**/
						}
					});
				}
			}
		});
	};
	var facebookLogin = function (req, res) {
		var user = req.body;
		var fbToken = user.fbToken;
		if (!fbToken && !user._id) {
			res.status(500).send("error");
		}
		fbController.getUserData(fbToken, function (result, err) {
			if (err) {
				res.status(500).send(err);
			}
			if (result) {
				var query = {};
				query._id = user._id;
				User.find(query, function (err, users) {
					if (err) {
						console.log(err);
						res.status(500).send(err);
					} else {
						if (users == null || users.length <= 0) {
							res.status(500).send("error");
						} else {
							// we already have this user, so use the old user.
							var currentUser = users[0];
							currentUser.first_name = result.first_name;
							currentUser.last_name = result.last_name;
							currentUser.gender = result.gender;
							currentUser.fbUserId = result.id;
							currentUser.fbPhotoUrl = result.picture.data.url;
							currentUser.fbToken = fbToken;
							var fireToken = tokenGenerator.createToken({
								uid: currentUser.token,
								first_name: currentUser.first_name,
								last_name: currentUser.last_name
							});
							currentUser.fireToken = fireToken;
							currentUser.isNeedLogin = false;
							currentUser.isLoggedIn = true;
							currentUser.save(function (e) {
								if (e) {
									console.log('Error saving user. ' + e.message);
									res.status(500).send("error");
								} else {
									console.log('User Saved ok.');
									res.status(201).send(currentUser);
									/**/
								}
							});
						}
					}
				});

			}

		})


	};

	var get = function (req, res) {
		res.status(201).send(req.authuser);
	};

	var findById = function (req, res) {
		User.findById(req.params.userId, function (err, user) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else if (user) {
				res.json(user);
			} else { //in case no user found.
				res.status(404).send("No User Found.");
			}
		});
	};

	var notification = function (req, res) {
		var notification_token = req.body.notification_token;
		User.find({_id: req.authuser._id}, function (err, users) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				var user = users[0];
				user.notification_token = req.body.notification_token;
				user.save(function (e) {
					if (e) {
						res.status(500).send("error"); //sending back status 201 which means it was created.
					} else {

						res.status(201).send(req.body.notification_token); //sending back status 201 which means it was created.


					}
				});
			}
		});

	};
	var findMe = function (req, res, next) {

		req.user = req.authuser;
		next();

	};


	var deleteAll = function (req, res, next) {
		User.remove({}, function (err, user) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(204).send("Removed");
			}
		});

	};

	var getByID = function (req, res) {

//no need
		/*	Friendship.find({

		 $or: [{friend1: req.user._id}, {friend2: req.user._id}]


		 }).populate("friend1 friend2", "firstName lastName fbPhotoUrl")
		 .exec(function (err, results) {
		 if (err) {
		 console.log('getByID -- There was a problem retuning user friendships, so returning without');
		 res.json(req.user);
		 } else {
		 //Friendship.populate(results, options,)
		 console.log('getByID -- Returning user with Friends.');
		 req.user.friends = results;
		 res.json(req.user);
		 }

		 });*/

		//add the friends to the user by using the Friendship schema

	};

	var patch = function (req, res) {
		if (req.user._id) { //we don't allow changing the _id, so we prevent it by deleting the '_id' parameter from the request body before we continue.
			delete req.body._id;
		}

		for (var param in req.body) {//we go over existing parameters from the JSON in the request body, and only change them.
			req.user[param] = req.body[param];
		}

		req.user.save(function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(req.user);
			}
		});
	};
	var logOut = function (req, res) {
		User.find({_id: req.authuser._id}, function (err, users) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				var user = users[0];
				user.isLoggedIn = false;
				user.save(function (e) {
					if (e) {
						res.status(500).send("error"); //sending back status 201 which means it was created.
					} else {

						res.status(201).send(user); //sending back status 201 which means it was created.


					}
				});
			}
		});
	}
	var deleteItem = function (req, res) {
		req.user.remove(function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(204).send("Removed");
			}
		});
	};


	var put = function (req, res) {

		req.user.firstName = req.body.firstName;
		req.user.lastName = req.body.lastName;
		req.user.email = req.body.email;
		req.user.password = req.body.password;


		req.user.save(function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(req.user);
			}
		});
	};
	var report = function (req, res) {
		var newReport = new Report(req.body);
		newReport.reporterUser = req.authuser._id;
		newReport.save(function (err) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.json(newReport);
			}
		});
	};

	var updateFbData = function (user, userFbData) {

		//update the user data
		console.log('Updating user according to FB data.');
		user.firstName = userFbData.firs_tName;
		user.lastName = userFbData.last_name;
		user.gender = userFbData.gender;
		user.fbId = userFbData.id;
		user.fbPhotoUrl = userFbData.picture.data.url;

		//save the user data
		user.save(function (e) {
			if (e) {
				console.log('Error saving user. ' + e.message);
			} else {
				console.log('User Saved ok.');
			}
		});

	};


	return {
		post: post,
		get: get,
		findById: findById,
		notification: notification,
		logOut: logOut,
		report: report,
		facebookLogin: facebookLogin,
		confirm: confirm,
		match: match,
		invite: invite,
		getFriends: getFriends,
		sendDahle:sendDahle
		//getByID: getByID,
		//patch: patch,
		//delete: deleteItem,
		//deleteall: deleteAll,
		//put: put,
		//updateFbData: updateFbData,
		//findMe:findMe
	};

};


function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = userController;
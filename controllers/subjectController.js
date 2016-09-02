/**
 * Created by Joe on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var User = require('../models/user.js');
var Category = require('../models/category.js');
var mongoose = require('mongoose');


var subjectController = function (Subject) {
		var interest = function (req, res) {
			var subjectId = req.body.subjectId;
			var query = {_id: subjectId};
			Subject.find(query)
				.exec(
					function (err, categories) {
						if (err) {
							console.log(err);
							res.status(500).send(err);
						} else {
							if (categories.length > 0) {
								categories[0].interested.push(req.authuser._id);
								categories[0].save(function (e) {
									if (e) {
										console.log('error: ' + e);
										res.status(500).send(err);
									} else {
										console.log('no error');
										res.status(203).send(categories[0]);
									}
								});
							}
						}
					});

		}

		var post = function (req, res) {
			var newSubject = req.body;
			var create_date = new Date();
			newSubject.create_date = create_date;
			newSubject.unix_date = create_date.valueOf();
			//      //       console.log('Loading x-access-token -- we have token: ' + token);
			var query = {};
			query._id = mongoose.Types.ObjectId(newSubject.user);

			//User.find(query, function (err, users) {
			//    if (err) {
			//        console.log('error: ' + e);
			//        res.status(500).send(err);
			//    }//    else{

			newSubject.user = req.authuser._id;
			newSubject.gender = req.authuser.gender;
			var subject = new Subject(newSubject);
			subject.save(function (e) {
				if (e) {
					console.log('error: ' + e);
					res.status(500).send(err);
				} else {
					console.log('no error');
					res.status(201).send(subject);
				}
			});
			//    }
			//});

		};

		var put = function (req, res) {
			var newCategory = req.body;
			var category = new Category(newCategory);
			category.save(function (e) {
				if (e) {
					console.log('error: ' + e);
					res.status(500).send(err);
				} else {
					console.log('no error');
					res.status(201).send(category);
				}
			});
		};
		var changeStatus = function (req, res) {
			var query = {_id: req.body._id};
			Subject.find(query)
				.exec(
					function (err, subjects) {
						if (err) {
							console.log(err);
							res.status(500).send(err);
						} else {
							if (subjects.length > 0) {
								subjects[0].status = req.body.status;
								subjects[0].save(function (e) {
									if (e) {
										console.log('error: ' + e);
										res.status(500).send(err);
									} else {
										console.log('no error');
										res.status(201).send(subjects[0]);
									}
								});
							}
						}
					});
		};

		var getCategories = function (req, res) {

			var query = {};
			Category.find(query)
				.exec(
					function (err, categories) {
						if (err) {
							console.log(err);
							res.status(500).send(err);
						} else {
							res.json(categories);
						}
					});
		};
		var get = function (req, res) {

			var query = {};
			var now = new Date();
			var skip = 0;
			var limit = 20;
			now.setHours(now.getHours() - subjectsDuration);
			query.create_date = {
				$gte: now
			}
			var userSubjects = req.query.userSubjects || false;
			var userId = mongoose.Types.ObjectId(req.authuser._id);
			if (req.query.userId !== "null") {
				userId = req.query.userId;
			}
			if (userSubjects === "true") {
				query.user = userId;
			} else {
				query.user = {$ne: mongoose.Types.ObjectId(req.authuser._id)};
			}
			if (req.body && req.body.gender && req.body.gender !== "both") {
				query.gender = req.body.gender;
			}
			if (req.body && (req.body.status != undefined||req.query.status != undefined)) {
				query.status = req.body.status || req.query.status;
			}
			if (req.body && req.body.categories && req.body.categories.length > 0) {
				for (var i = 0; i < req.body.categories.length; i++) {
					req.body.categories[i] = mongoose.Types.ObjectId(req.body.categories[i]);
				}
				query.category = {"$in": req.body.categories};

			}
			var subjectQuery = Subject.find(query);
			var subjectQueryCount = Subject.count(query);
			if (req.body && req.body.locationCoords && req.body.locationCoords.length > 0) {
				subjectQuery.where('locationCoords').near({center: [req.body.locationCoords[0], req.body.locationCoords[1]]});
				//subjectQuery;
				subjectQueryCount.where('locationCoords').near({center: [req.body.locationCoords[0], req.body.locationCoords[1]]});
				//query.locationCoords={$geoWithin: {$centerSphere: [ [ req.body.locationCoords[0],req.body.locationCoords[1] ], 5000]}};
				//query.locationCoords = {
				//	$near: {
				//		$maxDistance: 1000,
				//		$geometry: {type: 'Point', coordinates: [req.body.locationCoords[0], req.body.locationCoords[1]]}
				//	}
				//}
			}
			if (req.body && req.body.skip && req.body.limit) {
				skip = req.body.skip;
				limit = req.body.limit;
			}

			//query.locationCoords= { $near :
			//{
			//	$geometry: { type: "Point",  coordinates: [ req.body.locationCoords[0],req.body.locationCoords[1] ] },
			//	$minDistance: 1000,
			//	$maxDistance: 5000
			//}
			//}

			//}
			subjectQueryCount
				.populate('user')
				.populate('category')
				.exec(
					function (err, subjectCount) {
						if (err) {
							console.log(err);
							res.status(500).send(err);
						} else {
							subjectQuery.skip(skip).limit(limit)
								.populate('user')
								.populate('category')
								.sort({'create_date': -1})
								.exec(
									function (err, subjects) {
										if (err) {
											console.log(err);
											res.status(500).send(err);
										} else {
											res.status(200).send({subjects: subjects, count: subjectCount});
										}
									});

						}
					});
		};

		var deleteFunction = function (req, res) {
			var query = {};
			if (req.query._id) {
				query._id = mongoose.Types.ObjectId(req.query._id);
				Subject.remove(query, function (err, data) {
					if (err) {
						res.status(500).send(err);
					} else {
						res.status(204).send("Removed");
					}
				});
			}
			else {
				res.status(500).send("not found");

			}


		};

		return {
			post: post,
			get: get,
			delete: deleteFunction,
			put: put,
			getCategories: getCategories,
			interest: interest,
			changeStatus: changeStatus
		};

	}
	;

module.exports = subjectController;
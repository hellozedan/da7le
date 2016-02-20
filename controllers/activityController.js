/**
 * Created by josephk on 6/10/2015.
 */
var mongoose = require('mongoose');
var moment = require('moment');
var Friendship = require('../models/friendship');

var geocoderProvider = 'google';

var httpAdapter = 'https';
var extra = {
    apiKey: 'AIzaSyAdtlBq_l_Soa6YMJpyGjguaAo5Zth5CIo', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);


var User = require('../models/user');
var Utils = require('../utils/utils.js');
var Activity = require('../models/activity.js');

var activityController = function (Activity) {

    var post = function (req, res) {
        var newActivity = req.body;
        console.log(newActivity);
        newActivity.addedBy = req.authuser._id;

        var loc = newActivity.locationCoords;
        if (!newActivity.country && !newActivity.address && loc && loc.length == 2) {
            console.log("location auto fill");
            geocoder.reverse({lat: loc[1], lon: loc[0]}, function (err, res2) {
                newActivity.country = res2[0].country;
                newActivity.address = res2[0].formattedAddress;
                console.log('saveActivity - Begin.');


            });
        } else {
            console.log("location manual fill");

        }
        var activity = new Activity(newActivity);
        activity.save(function (e, activity) {
            if (e) {
                console.log('error');
                console.log('e: ' + e);
                res.status(500).send(err);
            } else {
                console.log('saveActivity - success.');
                res.status(201).send("success");

            }
        });
    };

    var get = function (req, res) {
        var friendsIds = [];
        var query = {};
        if (req.query.long && req.query.lat) { //todo fix this
            //console.log(req.query.long );
            var radius = 1000 /6371; //3963.2;  //10 miles
            //var radius = 80 / 6371;
            if (req.query.radius) {
                 radius = req.query.radius / 6371;
            }//8 kilometters
        //   var locationCoords = [req.query.long, req.query.lat];
            query.locationCoords = {$geoWithin: {$centerSphere: [[req.query.long, req.query.lat], radius]}};
            //query.locationCoords= {  $near: locationCoords,
            //    $maxDistance: radius
            //
            //}
        }
        Friendship.find({
            $or: [{friend1: req.authuser._id}, {friend2: req.authuser._id}]
        }).exec(function (err, results) {
            if (err) {
                console.log('getByID -- There was a problem retuning user friendships, so returning without');
            } else {
                //Friendship.populate(results, options,)
                console.log('getByID -- Returning user with Friends.');
                for (var j = 0; j < results.length; j++) {
                    if (results[j].friend2 != req.authuser._id) {
                        friendsIds.push(results[j].friend2);
                    }
                    else {
                        friendsIds.push(results[j].friend1);
                    }
                }
                friendsIds.push(req.authuser._id);
                //var startTime = moment().add(4, "hours").toDate();
               // var endTime = moment().toDate();
              ////  query.startTime = {"$gte": startTime};
             //   query.endTime = {"$lt": endTime};
                query.$or= [{addedBy:{$in:friendsIds} }, {visibility: "public"}];
                var options = {
                    path: 'addedBy.user',
                    model: 'User',
                    select: 'firstName lastName'
                };

                Activity.find(query)
                    .populate('addedBy', '_id firstName lastName fbPhotoUrl')
                    .exec(function (err, activities) {
                        //Activity.populate(activities, options, function (err, activities) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            res.json(activities);
                        }
                    });
                //});
            }
        });
    };

    var deleteAll = function (req, res, next) {
        Activity.remove({}, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send("Removed");
            }
        });

    };

    var findById = function (req, res, next) {
        var options = {
            path: 'knownParticipants.user',
            model: 'User',
            select: 'firstName lastName'
        };
        Activity.findById(req.params.activityId)
            .populate('knownParticipants')
            .exec(function (err, activitys) {
                Activity.populate(activitys, options, function (err, activity) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else if (activity) {
                        req.activity = activity;
                        next(); // continue to the request handling.
                    } else { //in case no activity found.
                        res.status(404).send("No Activity Found.");
                    }
                });
            });

    };


    var getByID = function (req, res) {
        res.json(req.activity);
    };

    var patch = function (req, res) {
        if (req.activity._id) { //we don't allow changing the _id, so we practivity it by deleting the '_id' parameter from the request body before we continue.
            delete req.body._id;
        }

        for (var param in req.body) {//we go over existing parameters from the JSON in the request body, and only change them.
            req.activity[param] = req.body[param];
        }

        req.activity.save(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.activity);
            }
        });
    };

    var deleteItem = function (req, res) {
        req.activity.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(204).send("Removed");
            }
        });
    };


    var put = function (req, res) {
        console.log("put");
        console.log(req.body);
        if (req.body.action === "addparticipant") {
            console.log("addparticipant");
            var activityid = req.body.activityid;
            var userid = req.authuser._id;//req.body.userid;
            console.log("activityid: " + activityid);
            console.log("userid" + userid);
            var newActivityParticipant = {
                activity: mongoose.Types.ObjectId(activityid),
                user: mongoose.Types.ObjectId(userid),
                visibility: "private",
                comment: "test1..."
            };

            var activityParticipant = new ActivityParticipant(newActivityParticipant);
            activityParticipant.save(function (e, d) {
                if (e) {
                    console.log('error');
                    console.log('e: ' + e);
                } else {
                    Activity.findById(activityid, function (err, activity) {

                        if (err) {
                            console.log(err);
                        } else {

                            var update = {"$push": {'knownParticipants': d._id}};
                            activity.update(update, {safe: true, upsert: true},
                                function (err, model) {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send(err);
                                        //return res.send(err);
                                    } else {
                                        console.log(activity);
                                        res.json(activity);
                                    }
                                });

                        }
                    });
                }
            });
        }
    };

    return {
        post: post,
        get: get,
        findById: findById,
        getByID: getByID,
        patch: patch,
        delete: deleteItem,
        deleteall: deleteAll,
        put: put
    };

};

var saveActivity = function (newActivity, req, res) {
    console.log('saveActivity - Begin.');
    var activity = new Activity(newActivity);
    activity.save(function (e, activity) {
        if (e) {
            console.log('error');
            console.log('e: ' + e);
        } else {
            console.log('saveActivity - Activity Saved ok, Creating activity participant.');
            var newActivityParticipant = {
                activity: activity._id,
                user: mongoose.Types.ObjectId(req.authuser._id),
                comment: "test3...",
                visibility: "public",
                visibleTime: Date.now(),
                status: "available"

            };
            var activityParticipant = new ActivityParticipant(newActivityParticipant);
            console.log('saveActivity - Activity Saved ok, Adding activity participant.');
            activityParticipant.save(function (e, d) {
                if (e) {
                    console.log('error');
                    console.log('e: ' + e);
                    res.status(500).send(err);
                } else {
                    console.log('saveActivity - participant saved ok, updating activity.');
                    var update = {"$push": {'knownParticipants': d._id}};
                    activity.update(update, {safe: true, upsert: true},
                        function (err, model) {
                            if (err) {
                                console.log(err);
                                res.status(500).send(err);
                            } else {
                                console.log('saveActivity - all ok. Activity: ' + activity);
                                res.status(201).send(activity); //sending back status 201 which means it was created.
                            }

                        });
                }
            });
        }
    });

}

module.exports = activityController;
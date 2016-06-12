/**
 * Created by ahmad on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var Friendship = require('../models/friendship');
var mongoose = require('mongoose');
var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator("EAJQd3evljqPu1TiHCne0ZAcJSdJ2qMxkSLA7j19");


var fbController = require('../controllers/fbController');

var userController = function (User) {

    var post = function (req, res) {
        var user = req.body;
        var fbToken = user.fbToken;
        var notification_token = user.notification_token;
        if (!fbToken) {
            res.status(500).send("error");
        }
        fbController.getUserData(fbToken,function(result,err){
            if(err){

            }
            if(result){
                var query = {};
                query.fbUserId = result.id;
                User.find(query, function (err, users) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        if (users == null || users.length <= 0) {
                            console.log('This is a new user.');
                            var token = require('crypto').randomBytes(64).toString('hex');
                            var user = {
                                first_name : result.first_name,
                                last_name : result.last_name,
                                gender : result.gender,
                                fbUserId : result.id,
                                fbPhotoUrl : result.picture.data.url,
                                fbCoverPhotoUrl : result.cover.source,
                                fbToken : fbToken,
                                token: token,
                                notification_token:  notification_token,
                                isNeedLogin:false

                            }
                            var fireToken = tokenGenerator.createToken({ uid: token, first_name: user.first_name ,last_name:user.last_name});
                            user.fireToken=fireToken;
                            var newUser = new User(user);
                            newUser.save(function (e) {
                                if (e) {
                                    res.status(500).send("error"); //sending back status 201 which means it was created.
                                } else {

                                    res.status(201).send(newUser); //sending back status 201 which means it was created.

                                }
                            });
                        }else{
                            // we already have this user, so use the old user.
                            var currentUser = users[0];
                            currentUser.first_name = result.first_name;
                            currentUser.last_name = result.last_name;
                            currentUser.gender = result.gender;
                            currentUser.fbUserId = result.id;
                            currentUser.fbPhotoUrl = result.picture.data.url;
                            currentUser.fbCoverPhotoUrl=result.cover.source
                            currentUser.fbToken = fbToken;
                            var fireToken = tokenGenerator.createToken({ uid: currentUser.token, first_name: currentUser.first_name ,last_name:currentUser.last_name});
                            currentUser.fireToken = fireToken;
                            currentUser.isNeedLogin = false;
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


        Friendship.find({

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

            });

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
        findById: findById//,
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
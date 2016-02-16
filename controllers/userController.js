/**
 * Created by ahmad on 06/06/2015.
 */

var Utils       = require('../utils/utils.js');
var Friendship  = require('../models/friendship');
var fbController = require('../controllers/fbController');

var userController = function (User) {

    var post = function (req, res) {
        var newUser={};
        var token = require('crypto').randomBytes(64).toString('hex');
            newUser.token = token;
        var user = new User(newUser);

        //console.log(user);
        user.save(function (e) {
            if (e) {
                console.log('error' + e)
            } else {
                req.authuser=user;
                fbController.getUserData(req, req.body.fbToken, function (authuser, err) {
                    if(err){
                        res.send('There was an error logging in. Please try again soon.');
                        res.status(500).send("error"); //sending back status 201 which means it was created.

                    }else{
                        res.status(201).send(authuser); //sending back status 201 which means it was created.
                    }
                });
            }
        });
    };

    var get = function (req, res) {
        var query = {};
        if (req.query.email) {   //todo fix this
            query.email = req.query.email; //that way we will allow only find by email, else it will bring back everything.
        }
        User.find(query, function (err, users) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(users);
            }
        });
    };

    var findById = function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next(); // continue to the request handling.
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

                 $or: [{friend1: req.user._id},{friend2: req.user._id}]


        }).populate("friend1 friend2", "firstName lastName fbPhotoUrl")
            .exec(function (err, results) {
            if(err){
                console.log('getByID -- There was a problem retuning user friendships, so returning without');
                res.json(req.user);
            }else{
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
        findById: findById,
        getByID: getByID,
        patch: patch,
        delete: deleteItem,
        deleteall: deleteAll,
        put: put,
        updateFbData: updateFbData,
        findMe:findMe
    };

};


function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = userController;
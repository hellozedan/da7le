/**
 * Created by Joe on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var User = require('../models/user.js');

var usertrackController = function(Usertrack){

    var post = function (req, res) {
    	var newUsertrack = req.body;    
    	newUsertrack.username = req.authuser.username;
        var usertrack = new Usertrack(newUsertrack);
        
//        if(usertrack.username) {
//        	User.find({username: usertrack.username, function (err, users) {
//                if (err) {
//                	console.log('usertrack: user does not exist!');
//                    res.status(500).send(err);
//                } else {
                	usertrack.save();
                	res.status(201).send(usertrack); //sending back status 201 which means it was created.
//                }
//            });    
//        } else {
//        	console.log('usertrack: username is missing!');
//            res.status(500).send(err);
//        }
    };

    var get = function (req, res) {
        var query = {};
        if (req.query.username) {   
            query.username = req.query.username; 
        }
        Usertrack.find(query, function (err, usertracks) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(usertracks);
            }
        });
    };

    var deleteAll = function(req, res, next){
        Usertrack.remove({}, function(err, usertrack) {
        	if(err){
                res.status(500).send(err);
            }else{
                res.status(204).send("Removed");
            }
        });
        
    };

    return{
        post: post,
        get: get,
        deleteall: deleteAll
    };

};

module.exports = usertrackController;
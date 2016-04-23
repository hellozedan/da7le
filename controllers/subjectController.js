/**
 * Created by Joe on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');


var subjectController = function(Subject){

    var post = function (req, res) {
        var newSubject= req.body;
        newSubject.user= mongoose.Types.ObjectId(newSubject.user);
        //newUsertrack.username = req.authuser.username;
        //var usertrack = new Usertrack(newUsertrack);
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
    };

    var get = function (req, res) {
        var query = {};

        Subject.find(query, function (err, subjects) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(subjects);
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

module.exports = subjectController;
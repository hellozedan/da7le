/**
 * Created by Joe on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var User = require('../models/user.js');
var Category = require('../models/category.js');
var mongoose = require('mongoose');



var subjectController = function(Subject){
    var post = function (req, res) {
        var newSubject= req.body;
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
        //    }
        //    else{
                newSubject.user=req.authuser._id;
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
        var newCategory= req.body;
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
        var userSubjects = req.query.userSubjects || false;
        var userId = mongoose.Types.ObjectId(req.authuser._id);
        if(req.query.userId !=="null"){
            userId = req.query.userId;
        }
        if(userSubjects === "true"){
            query.user = userId;
        }else{
            query.user =   { $ne: mongoose.Types.ObjectId(req.authuser._id) };
        }

        Subject.find(query)
            .populate('user')
            .exec(
            function (err, subjects) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json(subjects);
            }
        });
    };

    var deleteFunction = function(req, res){
        var query={};
        if (req.query._id) {
            query._id=mongoose.Types.ObjectId(req.query._id);
            Subject.remove(query, function(err, data) {
                if(err){
                    res.status(500).send(err);
                }else{
                    res.status(204).send("Removed");
                }
            });
        }
        else
        {
            res.status(500).send("not found");

        }


        
    };

    return{
        post: post,
        get: get,
        delete: deleteFunction,
        put: put,
        getCategories:getCategories
    };

};

module.exports = subjectController;
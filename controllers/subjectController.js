/**
 * Created by Joe on 06/06/2015.
 */

var Utils = require('../utils/utils.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');


var subjectController = function(Subject){

    var post = function (req, res) {
        var newSubject= req.body;
        //      //       console.log('Loading x-access-token -- we have token: ' + token);
      var query = {};
      query._id = mongoose.Types.ObjectId(newSubject.user);

      User.find(query, function (err, users) {
          if (err) {
              console.log('error: ' + e);
              res.status(500).send(err);
          }
          else{
              newSubject.user=users[0]._doc._id;
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
          }
      });

    };

    var get = function (req, res) {
        var query = {};

        if (req.query._id) {   //todo fix this
            query.user =   { $ne: mongoose.Types.ObjectId(req.query._id) }; //that way we will allow only find by email, else it will bring back everything.
        }
        Subject.find(query)
            .populate('user', 'name')
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
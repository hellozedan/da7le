/**
 * Created by ahmad on 7/24/15.
 */
var FB = require('fb');
//Step = require('step');

var APP_ID = '1772880012943378';
var APP_SECRET = '29cc8b489a60aca48e425fdb69c67062';
var APP_CREDENTIALS = 'client_credentials';

//var userController = require("./userController");
var User = require('../models/user.js');
var Friendship = require('../models/friendship');

var fbController = (function () { // the fb controller singelton
    var APP_TOKEN; //the singleton is defined by the token

    function initToken(callback) {

        FB.api('oauth/access_token', {
            client_id: APP_ID,
            client_secret: APP_SECRET,
            grant_type: APP_CREDENTIALS
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }

            APP_TOKEN = res.access_token;
            FB.setAccessToken(APP_TOKEN);
            console.log("access token: " + APP_TOKEN);
            callback();

        });
    }

    function updateFbFriendsAndRelations(data, currentUserId, callback) {
        var idsArray = [];
        for (var i = 0; i < data.length; i++) {
            idsArray[i] = data[i].id;
        }
        //idsArray = ["10205779177332691","10205144427502699"]; //hardcoded for testing only
        User.find({
            'fbId': {$in: idsArray}
        }, function (err, docs) {

            if (err) {
                console.log('there was an error reading FB Friends')
            } else {
                console.log(docs);   //doc[i]._doc._id
                var friendships = [];
                var friendshipsIds = [];
                for (var j = 0; j < docs.length; j++) {
                    var tmpFreindship = new Friendship;
                    tmpFreindship.friend1 = currentUserId;
                    tmpFreindship.connFb = true;
                    tmpFreindship.friend2 = docs[j]._doc._id;
                    friendships[j] = tmpFreindship;
                }
                Friendship.create(friendships, function (err, createdFriendships) {
                    if (err) {
                        console.log('updateFbFriendsAndRelations -- There was an error saving friendships: ' + err);
                    }
                    else {
                        //for (var j = 0; j < createdFriendships.length; j++) {
                        //    friendshipsIds.push(createdFriendships[j]._doc._id);
                        //    User.findById(createdFriendships[j]._doc.friend2, function (err, user) {
                        //        if (err) {
                        //
                        //        }
                        //        else {
                        //            user.friends.push(createdFriendships[j]._doc._id);
                        //            user.save(function (err) {
                        //                if (err) {
                        //                }
                        //            });
                        //        }
                        //
                        //    });
                        //}
                        //User.findById(currentUserId, function (err, user) {
                        //    if (err) {
                        //
                        //    }
                        //    else {
                        //        user.friends=friendshipsIds;
                        //        user.save(function (err) {
                        //            if (err) {
                        //            }
                        //        });
                        //    }
                        //
                        //});
                    }
                });

            }
            //go over all the doc and users ids in it and create "friendship" for all
            //create a batch insert query and insert it at once.
        });


        callback();

    }

    module.exports = {
        getUserData: function getUserData(userFbToken, callback) {
            if (!APP_TOKEN) {
                console.log('getting app token');
                initToken(function () {
                    console.log('ready for usage after init.');
                });
            }
            console.log('ready for usage regular.');
            FB.api('me', {
                fields: 'id,first_name,last_name,email,gender,picture.width(400),friends,likes,cover.width(600).height(300)',
                limit: 20,
                access_token: userFbToken
            }, function (result) {
                if (!result || result.error) {
                    console.log("fb err: " + result.error.message);
                } else {
                    console.log("fb result: " + result);

                    callback(result);
                    //before we save the data we received from FB we should check according to FB ID if the user already exist
                    // with a different guestId (for instance if the user switched a mobile device or so..)
                    //var query = {};
                    //query.fbId = result.id;

                    //User.find(query, function (err, users) {
                    //    if (err) {
                    //        console.log(err);
                    //        res.status(500).send(err);
                    //    } else {
                    //        if (users == null || users.length <= 0) { //in case this is a new user
                    //
                    //            console.log('This is a new user.');
                    //            var user = {
                    //                first_name : result.first_name,
                    //                last_name : result.last_name,
                    //                gender : result.gender,
                    //                fbUserId : result.id,
                    //                fbPhotoUrl : result.picture.data.url,
                    //                fbToken : userFbToken,
                    //            }
                    //            req.authuser.firstName = result.first_name;
                    //            req.authuser.lastName = result.last_name;
                    //            req.authuser.gender = result.gender;
                    //            req.authuser.fbId = result.id;
                    //            req.authuser.fbPhotoUrl = result.picture.data.url;
                    //            req.authuser.fbToken = userFbToken;
                    //            //req.authuser.fbFriends = result.friends.data;
                    //
                    //            req.authuser.save(function (e) {
                    //                if (e) {
                    //                    console.log('Error saving user. ' + e.message);
                    //                    callback(req.authuser, e);
                    //                } else {
                    //                    console.log('User Saved ok.');
                    //                    //adding FB Friendships.
                    //                    updateFbFriendsAndRelations(result.friends.data, req.authuser._id, function () {
                    //                        console.log("updateFbFriendsAndRelations - Done.")
                    //                    });
                    //                    callback(req.authuser);
                    //                }
                    //            });
                    //
                    //
                    //        } else { // we already have this user, so use the old user.
                    //
                    //            if (users[0].token == req.authuser.token) {
                    //                console.log('We already have this user. Will update data.');
                    //
                    //                req.authuser.firstName = result.first_name;
                    //                req.authuser.lastName = result.last_name;
                    //                req.authuser.gender = result.gender;
                    //                req.authuser.fbId = result.id;
                    //                req.authuser.fbPhotoUrl = result.picture.data.url;
                    //                req.authuser.fbToken = userFbToken;
                    //                //req.authuser.fbFriends = result.friends.data;
                    //
                    //                req.authuser.save(function (e) {
                    //                    if (e) {
                    //                        console.log('Error saving user. ' + e.message);
                    //                        callback(req.authuser, e);
                    //                    } else {
                    //                        console.log('User Saved ok.');
                    //                        callback(req.authuser);
                    //                    }
                    //                });
                    //            } else {
                    //                console.log('We already have this user with another token');
                    //
                    //
                    //                var userToDelete = req.authuser;
                    //
                    //                req.authuser = users[0];
                    //
                    //                req.authuser.firstName = result.first_name;
                    //                req.authuser.lastName = result.last_name;
                    //                req.authuser.gender = result.gender;
                    //                req.authuser.fbId = result.id;
                    //                req.authuser.fbPhotoUrl = result.picture.data.url;
                    //                req.authuser.fbToken = userFbToken;
                    //                //req.authuser.fbFriends = result.friends.data;
                    //
                    //                req.authuser.save(function (e) {
                    //                    if (e) {
                    //                        console.log('Error saving user. ' + e.message);
                    //                        callback(req.authuser);
                    //                    } else {
                    //                        console.log('User Saved ok.');
                    //                        callback(req.authuser);
                    //                        /**/
                    //                    }
                    //                });
                    //
                    //                userToDelete.remove(function (err) {
                    //                    if (err) {
                    //                        console.log('There was error removing Unused user: ' + userToDelete._id);
                    //                    } else {
                    //                        console.log('Unused User Removed');
                    //                    }
                    //                });
                    //
                    //            }
                    //
                    //
                    //        }
                    //    }
                    //});


                }
            });

        }
    }


})();

module.exports.fbController = fbController;
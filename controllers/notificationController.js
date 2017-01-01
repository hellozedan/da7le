/**
 * Created by zedan on 5/20/2016.
 */
var Utils = require('../utils/utils.js');
var notificationController = function (User) {
    function post(req, res) {
        if (!req.body.user && !req.body.message ) {
            res.status(500).send("error");
        }
        var user = {_id: mongoose.Types.ObjectId(req.body.user)};
        User.find(user, function (err, users) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                if (users.length == 0) {
                    res.status(500).send("no User");
                }
                else {
                    if (!users[0].isNeedLogin) {
                        var senderName='';
                        users[0].friends.forEach(function (elemnt) {
                            if(elemnt._id.toString()===req.authuser._id.toString())
                            {
                                senderName=elemnt.nickname;
                            }
                        })
                        var web_request_https = require('https');
                        var notifications_request_host = 'onesignal.com';
                        var notifications_request_path = '/api/v1/notifications';
                        var notifications_request_autho = 'Basic MmI2YWU3NTEtOGQ0ZS00YzFhLWI0MTQtZmUyZTM2YjQ2ZDc3';
                        var notifications_app_id = 'f4348bab-6374-4533-9781-75bb7041baf3';
                        var template_id = 'a59cd1f2-78ad-47b3-a8ee-3c9518b2420e';
                        var postData = JSON.stringify({
                            app_id: notifications_app_id,
                             template_id: template_id,
                            include_player_ids: [users[0].notification_token],
                            contents: {
                                en: senderName + ": " + req.body.message
                            },
                            android_group: req.body.user,
                            data: {
                                // conversationId: req.body.conversationId,
                                userName: req.body.userName,
                                subjectName: req.body.subjectName,
                                fbPhotoUrl: req.body.fbPhotoUrl
                            }
                        });

                        var options = {
                            host: notifications_request_host,
                            path: notifications_request_path,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': notifications_request_autho
                            }
                        };
                        var newReq = web_request_https.request(options, function (phone_res) {
                            var result = '';
                            phone_res.setEncoding('utf8');
                            phone_res.on('data', function (chunk) {
                                result += chunk;
                            });

                            phone_res.on('end', function (data) {
                                res.status(201).send("sent");
                            });

                            phone_res.on('error', function (err) {
                                res.status(500).send("error");
                            });
                        });


                        newReq.on('error', function (err) {
                            res.status(500).send("error");

                        });

                        newReq.write(postData);
                        newReq.end();
                    }
                }
            }
        });
    }



    return {
        post: post
        //,
        // get: get//,
        //findById: findById,
        //getByID: getByID,
        //patch: patch,
        //delete: deleteItem,
        //deleteall: deleteAll,
        //put: put,
        //updateFbData: updateFbData,
        //findMe:findMe
    };

};


var mongoose = require('mongoose');
module.exports = notificationController;
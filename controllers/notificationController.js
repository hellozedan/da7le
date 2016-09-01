/**
 * Created by zedan on 5/20/2016.
 */
var Utils = require('../utils/utils.js');
var mongoose = require('mongoose');


var notificationController = function (User) {
    function post(req, res) {
        if (!req.body.user && !req.body.message && !req.body.conversationId) {
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
                    if (users[0].isLoggedIn) {
                        var web_request_https = require('https');
                        var notifications_request_host = 'onesignal.com';
                        var notifications_request_path = '/api/v1/notifications';
                        var notifications_request_autho = 'Basic NTJkNWUzZGUtZTMzYy00Y2U4LTg0NWEtMTA2YTZmNzE1ODEy';
                        var notifications_app_id = 'ee6f85c1-a2ff-4d1b-9fa6-29dd4cc306ef';
                        var template_id = '2dea08d5-6233-4515-b648-963be1a6592e';
                        var postData = JSON.stringify({
                            app_id: notifications_app_id,
                            template_id: template_id,
                            include_player_ids: [users[0].notification_token],
                            contents: {
                                en: req.body.userName + ": " + req.body.message
                            },
                            android_group: req.body.conversationId,
                            data: {
                                conversationId: req.body.conversationId,
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
        post: post//,
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
module.exports = notificationController;
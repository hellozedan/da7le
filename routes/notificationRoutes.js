/**
 * Created by Joe on 06/06/2015.
 */

var express = require('express');


var routes = function(Subject) {
    var notificationRouter = express.Router();

    var notificationController = require("../controllers/notificationController")(Subject);

    notificationRouter.route('/')
        .post(notificationController.post);

    return notificationRouter;
};

module.exports =  routes;

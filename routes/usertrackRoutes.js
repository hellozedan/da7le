/**
 * Created by Joe on 06/06/2015.
 */

var express = require('express');


var routes = function(Usertrack) {
    var usertrackRouter = express.Router();

    var usertrackController = require("../controllers/usertrackController")(Usertrack);

    usertrackRouter.route('/')
        .post(usertrackController.post)
        .get(usertrackController.get)
        .delete(usertrackController.deleteall);

    return usertrackRouter;
};

module.exports =  routes;

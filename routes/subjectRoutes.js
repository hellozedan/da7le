/**
 * Created by Joe on 06/06/2015.
 */

var express = require('express');


var routes = function(Subject) {
    var subjectRouter = express.Router();

    var subjectController = require("../controllers/subjectController")(Subject);

    subjectRouter.route('/')
        .post(subjectController.post)
        .get(subjectController.get)
        .delete(subjectController.delete);

    return subjectRouter;
};

module.exports =  routes;

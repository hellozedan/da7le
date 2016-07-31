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
        .put(subjectController.put)
        .delete(subjectController.delete);
    subjectRouter.route('/filter')
        .post(subjectController.get);
    subjectRouter.route('/interested')
        .post(subjectController.interest);
    subjectRouter.route('/categories')
        .get(subjectController.getCategories)


    return subjectRouter;
};

module.exports =  routes;

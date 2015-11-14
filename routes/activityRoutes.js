/**
 * Created by josephk on 6/10/2015.
 */


var express = require('express');


var routes = function(Activity) {
    var activityRouter = express.Router();

    var activityController = require("../controllers/activityController")(Activity);

    activityRouter.route('/')
        .post(activityController.post)
        .put(activityController.put)
        .get(activityController.get)
        .delete(activityController.deleteall);


    activityRouter.use('/:activityId', activityController.findById);

    activityRouter.route('/:activityId')
        .get(activityController.getByID)
        .patch(activityController.patch)
        .delete(activityController.delete)
        .put(activityController.put);

    return activityRouter;
};

module.exports =  routes;

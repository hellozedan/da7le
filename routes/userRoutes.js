/**
 * Created by Joe on 06/06/2015.
 */

var express = require('express');


var routes = function(User) {
    var userRouter = express.Router();

    var userController = require("../controllers/userController")(User);

    userRouter.route('/')
        .post(userController.post)
        .get(userController.get)
        .delete(userController.deleteall);


    userRouter.use('/me', userController.findMe);

    //userRouter.use('/:userId', userController.findById);

    userRouter.route('/me')
        .get(userController.getByID)
        .patch(userController.patch)
        .delete(userController.delete)
        .put(userController.put);

    return userRouter;
};

module.exports =  routes;

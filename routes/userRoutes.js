/**
 * Created by ahmad on 06/06/2015.
 */

var express = require('express');


var routes = function(User) {
    var userRouter = express.Router();

    var userController = require("../controllers/userController")(User);

    userRouter.route('/')
        .post(userController.post)
        .get(userController.get);

    userRouter.route('/:userId')
        .get(userController.findById);
      //  .delete(userController.deleteall);


    //userRouter.use('/me', userController.findMe);
    //


    //userRouter.route('/me')
    //    .get(userController.getByID)
    //    .patch(userController.patch)
    //    .delete(userController.delete)
    //    .put(userController.put);

    return userRouter;
};

module.exports =  routes;

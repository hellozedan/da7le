/**
 * Created by ahmad on 06/06/2015.
 */

var express = require('express');


var routes = function (User) {
	var userRouter = express.Router();

	var userController = require("../controllers/userController")(User);

	userRouter.route('/')
		.post(userController.post)
		.get(userController.get);
	userRouter.route('/notification')
		.post(userController.notification);
	userRouter.route('/confirm')
		.post(userController.confirm);
	userRouter.route('/invite')
		.post(userController.invite);
	userRouter.route('/match')
		.post(userController.match);
	userRouter.route('/facebookLogin')
		.post(userController.facebookLogin);
	userRouter.route('/logOut')
		.get(userController.logOut);

	userRouter.route('/getFriends')
		.get(userController.getFriends);

	userRouter.route('/report')
		.post(userController.report);
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

module.exports = routes;

/**
 * Created by ahmad on 06/06/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var activitylikerModel = new Schema({
	"activity":
	{
		type: Schema.Types.ObjectId, 
		ref: 'Activity',
		"description": "activity...",
	},
	"user":
	{
		type: Schema.Types.ObjectId, 
		ref: 'User',
		"description": "Interested user",
	}
});

module.exports= mongoose.model('ActivityInterested', activitylikerModel);
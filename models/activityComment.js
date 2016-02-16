/**
 * Created by ahmad on 06/06/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var activityCommentModel = new Schema({
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
		"description": "commenter user",
	},
	"comment":{
        type:String,
        description: "comment to an activity"
    }
});

module.exports= mongoose.model('ActivityComment', activityCommentModel);
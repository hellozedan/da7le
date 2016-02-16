/**
 * Created by ahmad on 06/06/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var activityModel = new Schema({
    "title":{
        type:String,
        description: "Title of the activity"
    },
    "description":{
        type:String,
        description: "Brief description about the activity"
    },
    "locationCoords": {
	    type: [Number],
	    index: '2d'
	},
    "address":{
        type:String,
        description: "Address of the activity"
    },
    "country":{
        type:String,
        description: "Country of the activity"
    },

    "Comments":
    	[{
    		type: Schema.Types.ObjectId, 
    		ref: 'ActivityComment',
    		"description": "Array of commenters  users"
		}]
    ,
    "Interested":
        [{
            type: Schema.Types.ObjectId,
            ref: 'ActivityInterested',
            "description": "Array of Interested users "
        }]
    ,
    "addedTime":{
    	type: Date,
        default: Date.now,
        description: "Timestamp of the addition time and date"
    },
    "startTime":{
        type: Date,
        description: "Timestamp of the start Time"
    },
    "endTime":{
        type: Date,
        description: "Timestamp of the end Time"
    },
    "addedBy":{
        type: Schema.Types.ObjectId,
        ref: 'User',
        "description": "the adder user"
    },
    "visibility":{
        type:String,
        description: "visibility of the activity",
        default: "",
        enum: [
            "public",
            "private",
            "internal"
        ]
    },
    "category":{
        type:String,
        description: "category of the activity",
        default: "",
        enum: [
            "cat1",
            "cat2",
            "cat3",
            "cat4",
            "cat5"
        ]
    }
});

//this will expose the the "activityModel" we defined above under the name "Activity" to other JS files to use it under node.js
module.exports= mongoose.model('Activity', activityModel);
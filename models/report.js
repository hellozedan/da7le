/**
 * Created by ahmad on 06/06/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var reportModel = new Schema({
    "reason":{
        type:String,
        description: "Title of the activity"
    },
    "user":{
        type:Schema.Types.ObjectId,
        description: "Brief description about the activity"
    }
});

//this will expose the the "activityModel" we defined above under the name "Activity" to other JS files to use it under node.js
module.exports= mongoose.model('Report', reportModel);
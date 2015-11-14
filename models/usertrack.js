/**
 * Created by Joe on 06/06/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var usertrackModel = new Schema({
    "user":{type:Schema.Types.ObjectId,ref: 'User'},
    "locationCoords": {
        type: [Number],
        index: "2d"
    },
    "ts":{
    	type: Date,
        default: Date.now,
        description: "Timestamp of the track date/time"
    },
});

module.exports= mongoose.model('Usertrack', usertrackModel);
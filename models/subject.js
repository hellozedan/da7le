/**
 * Created by Joe on 06/06/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var subjectModel = new Schema({
    "user":{type:Schema.Types.ObjectId,ref: 'User'},
    "title": {
        type: String
    }
    //"ts":{
    //	type: Date,
    //    default: Date.now,
    //    description: "Timestamp of the track date/time"
    //},
});

module.exports= mongoose.model('Subject', subjectModel);
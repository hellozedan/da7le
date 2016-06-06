/**
 * Created by Joe on 06/06/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var subjectModel = new Schema({
    "user":{type:Schema.Types.ObjectId,ref: 'User'},
    "categories": [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        "description": "Array of categories"
    }],
    "title": {
        type: String
    },
    "description":{
        type: String
    },
    create_date: { type: Date, default: Date.now, required: true },
    unix_date: { type: Number, required: true }

    //"ts":{
    //	type: Date,
    //    default: Date.now,
    //    description: "Timestamp of the track date/time"
    //},
});

module.exports= mongoose.model('Subject', subjectModel);